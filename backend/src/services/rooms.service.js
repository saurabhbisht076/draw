// backend/src/services/rooms.service.js
const Player = require('../models/player.model');
const Room = require('../models/room.model');
const RoomPlayer = require('../models/roomPlayer.model');
const { generateRoomCode } = require('../utils/codeGenerator');
const { DEFAULT_ROOM_SETTINGS, ROOM_STATE, STATUS_CODES, MESSAGES } = require('../config/common.constant');
const cleanupService = require('./cleanup.service');

async function createRoomService(playerName) {
  // Step 1: Create host player
  const player = await Player.create({ name: playerName });

  // Step 2: Generate unique room code
  let roomCode, room;
  do {
    roomCode = generateRoomCode();
    try {
      room = await Room.create({
        code: roomCode,
        hostId: player.id,
        settings: DEFAULT_ROOM_SETTINGS,
        state: ROOM_STATE.LOBBY
      });
    } catch (err) {
      if (err.name !== 'SequelizeUniqueConstraintError') throw err;
      room = null;
    }
  } while (!room);

  // Step 3: Add host to room_players
  await room.addPlayer(player);

  // Schedule cleanup for idle lobby (30 minutes)
  cleanupService.scheduleRoomCleanup(room.id, room.code, 30 * 60 * 1000);

  return { room, player, isHost: true };
}

async function getRoomService(roomCode) {
  const room = await Room.findOne({ 
    where: { code: roomCode }, 
    include: ['players', 'host'] 
  });
  
  if (!room) {
    const error = new Error(MESSAGES.NOT_FOUND);
    error.status = STATUS_CODES.NOT_FOUND;
    throw error;
  }
  return room;
}

async function joinRoomService(roomCode, playerName, io) {
  const room = await Room.findOne({ 
    where: { code: roomCode }, 
    include: ['players', 'host'] 
  });
  
  if (!room) {
    const error = new Error('Room not found');
    error.status = STATUS_CODES.NOT_FOUND;
    throw error;
  }

  // Check if room is full
  if (room.players.length >= room.settings.maxPlayers) {
    const error = new Error('Room is full');
    error.status = STATUS_CODES.BAD_REQUEST;
    throw error;
  }

  // Check if game already started
  if (room.state === ROOM_STATE.IN_GAME) {
    const error = new Error('Game already in progress');
    error.status = STATUS_CODES.BAD_REQUEST;
    throw error;
  }

  const player = await Player.create({ name: playerName });
  await room.addPlayer(player);
  await room.reload({ include: ['players', 'host'] });

  // Cancel idle cleanup since room is active
  cleanupService.cancelRoomCleanup(room.id);

  // Emit event to room
  io.to(room.code).emit('room:joined', {
    players: room.players.map(p => ({ id: p.id, name: p.name }))
  });

  return { room, player };
}

async function leaveRoomService(roomCode, playerId, io) {
  const room = await Room.findOne({ 
    where: { code: roomCode }, 
    include: ['players'] 
  });
  
  if (!room) {
    const error = new Error('Room not found');
    error.status = STATUS_CODES.NOT_FOUND;
    throw error;
  }

  await room.removePlayer(playerId);
  await room.reload({ include: ['players'] });

  // If no players left, mark as finished and schedule immediate cleanup
  if (room.players.length === 0) {
    room.state = ROOM_STATE.FINISHED;
    await room.save();
    
    // Schedule immediate cleanup for empty rooms
    cleanupService.scheduleRoomCleanup(room.id, room.code, 2 * 60 * 1000); // 2 minutes
    
    io.to(room.code).emit('room:left', { 
      players: [], 
      state: room.state 
    });
    return room;
  }

  // If host left, assign new host
  if (room.hostId === playerId) {
    room.hostId = room.players[0].id;
    await room.save();
  }

  io.to(room.code).emit('room:left', {
    players: room.players.map(p => ({ id: p.id, name: p.name })),
    hostId: room.hostId
  });

  return room;
}

async function updateRoomSettingsService(roomCode, playerId, newSettings, io) {
  const room = await Room.findOne({ where: { code: roomCode } });
  
  if (!room) {
    const error = new Error('Room not found');
    error.status = STATUS_CODES.NOT_FOUND;
    throw error;
  }
  
  if (room.hostId !== playerId) {
    const error = new Error('Only host can update settings');
    error.status = STATUS_CODES.FORBIDDEN;
    throw error;
  }

  room.settings = { ...room.settings, ...newSettings };
  await room.save();

  io.to(room.code).emit('room:settingsUpdated', { settings: room.settings });
  return room;
}

async function startGameService(roomCode, playerId, io) {
  const room = await Room.findOne({ 
    where: { code: roomCode },
    include: ['players']
  });
  
  if (!room) {
    const error = new Error('Room not found');
    error.status = STATUS_CODES.NOT_FOUND;
    throw error;
  }
  
  if (room.hostId !== playerId) {
    const error = new Error('Only host can start game');
    error.status = STATUS_CODES.FORBIDDEN;
    throw error;
  }

  // Check minimum players
  if (room.players.length < 2) {
    const error = new Error('Need at least 2 players to start');
    error.status = STATUS_CODES.BAD_REQUEST;
    throw error;
  }

  room.state = ROOM_STATE.IN_GAME;
  await room.save();

  // Cancel any existing cleanup and schedule game completion cleanup
  cleanupService.cancelRoomCleanup(room.id);
  
  // Calculate game duration based on settings
  const gameDurationMs = (room.settings.rounds * room.settings.roundTime * 1000) + (5 * 60 * 1000); // +5 min buffer
  cleanupService.scheduleRoomCleanup(room.id, room.code, gameDurationMs);

  io.to(room.code).emit('room:started', { state: room.state });
  return room;
}

// New function to end game
async function endGameService(roomCode, playerId, io) {
  const room = await Room.findOne({ where: { code: roomCode } });
  
  if (!room) {
    const error = new Error('Room not found');
    error.status = STATUS_CODES.NOT_FOUND;
    throw error;
  }
  
  if (room.hostId !== playerId) {
    const error = new Error('Only host can end game');
    error.status = STATUS_CODES.FORBIDDEN;
    throw error;
  }

  room.state = ROOM_STATE.FINISHED;
  await room.save();

  // Schedule cleanup 5 minutes after game ends
  cleanupService.scheduleRoomCleanup(room.id, room.code, 5 * 60 * 1000);

  io.to(room.code).emit('room:ended', { state: room.state });
  return room;
}

module.exports = { 
  createRoomService, 
  joinRoomService, 
  getRoomService,  
  leaveRoomService,
  updateRoomSettingsService,
  startGameService,
  endGameService
};