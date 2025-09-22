const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Player = require('./player.model');

const Room = sequelize.define('Room', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  code: { type: DataTypes.STRING(8), unique: true, allowNull: false },
  settings: { type: DataTypes.JSONB, allowNull: false },
  state: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'rooms', timestamps: true });

// Host association
Room.belongsTo(Player, { as: 'host', foreignKey: 'hostId' });

module.exports = Room;
