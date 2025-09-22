const Player = require('../models/player.model');
const Room = require('../models/room.model');
const RoomPlayer = require('../models/roomPlayer.model');
const { generateRoomCode } = require('../utils/codeGenerator');
const { DEFAULT_ROOM_SETTINGS,ROOM_STATE, STATUS_CODES, MESSAGES } = require('../config/common.constant');

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

  return { room, player, isHost: true };
}


async function getRoomService(roomCode) {
  const room = await Room.findOne({ where: { code: roomCode }, include: ['players', 'host'] });
  if (!room) {
    const error = new Error(MESSAGES.NOT_FOUND);
    error.status = STATUS_CODES.NOT_FOUND;
    throw error;
  }
  return room;
}
async function joinRoomService(roomCode, playerName, io) {
    const room = await Room.findOne({ where: { code: roomCode }, include: ['players', 'host'] });
    if (!room) throw new Error('Room not found');

    const player = await Player.create({ name: playerName });
    await room.addPlayer(player);
    await room.reload({ include: ['players', 'host'] });

    // Emit event to room
    io.to(room.code).emit('room:joined', {
        players: room.players.map(p => ({ id: p.id, name: p.name }))
    });

    return { room, player };
}

async function leaveRoomService(roomCode, playerId, io) {
    const room = await Room.findOne({ where: { code: roomCode }, include: ['players'] });
    if (!room) throw new Error('Room not found');

    await room.removePlayer(playerId);
    await room.reload({ include: ['players'] });

    if (room.players.length === 0) {
        await Room.destroy({ where: { id: room.id } });
        room.state = ROOM_STATE.FINISHED;
        io.to(room.code).emit('room:left', { players: [], state: room.state });
        return room;
    }

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
    if (!room) throw new Error('Room not found');
    if (room.hostId !== playerId) throw new Error('Only host can update settings');

    room.settings = { ...room.settings, ...newSettings };
    await room.save();

    io.to(room.code).emit('room:settingsUpdated', { settings: room.settings });
    return room;
}

async function startGameService(roomCode, playerId, io) {
    const room = await Room.findOne({ where: { code: roomCode } });
    if (!room) throw new Error('Room not found');
    if (room.hostId !== playerId) throw new Error('Only host can start game');

    room.state = ROOM_STATE.IN_GAME;
    await room.save();

    io.to(room.code).emit('room:started', { state: room.state });
    return room;
}

module.exports = { createRoomService, joinRoomService, getRoomService,  leaveRoomService,
  updateRoomSettingsService,
  startGameService
};
