const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Player = require('./player.model');
const Room = require('./room.model');

const RoomPlayer = sequelize.define('RoomPlayer', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true }
}, { tableName: 'room_players', timestamps: true });

// Many-to-many relation
Room.belongsToMany(Player, { through: RoomPlayer, as: 'players', foreignKey: 'roomId' });
Player.belongsToMany(Room, { through: RoomPlayer, as: 'rooms', foreignKey: 'playerId' });

module.exports = RoomPlayer;
