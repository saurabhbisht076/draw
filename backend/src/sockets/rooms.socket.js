const Room = require('../models/room.model');
const Player = require('../models/player.model');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Player joins a room
    socket.on('joinRoom', async ({ roomCode, playerId }) => {
      socket.join(roomCode);

      const room = await Room.findOne({ where: { code: roomCode }, include: ['players'] });
      io.to(roomCode).emit('room:joined', {
        players: room.players.map(p => ({ id: p.id, name: p.name }))
      });
    });

    // Player leaves a room
    socket.on('leaveRoom', async ({ roomCode, playerId }) => {
      socket.leave(roomCode);

      const room = await Room.findOne({ where: { code: roomCode }, include: ['players'] });
      io.to(roomCode).emit('room:left', {
        players: room.players.map(p => ({ id: p.id, name: p.name }))
      });
    });

    // Host updates settings
    socket.on('updateSettings', async ({ roomCode, settings }) => {
      const room = await Room.findOne({ where: { code: roomCode } });
      room.settings = { ...room.settings, ...settings };
      await room.save();

      io.to(roomCode).emit('room:settingsUpdated', { settings: room.settings });
    });

    // Host starts game
    socket.on('startGame', async ({ roomCode }) => {
      const room = await Room.findOne({ where: { code: roomCode } });
      room.state = 'in-game';
      await room.save();

      io.to(roomCode).emit('room:started', { state: room.state });
    });

    socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
  });
};
