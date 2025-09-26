// backend/src/routes/admin.routes.js
const express = require('express');
const { Sequelize } = require('sequelize');
const Room = require('../models/room.model');
const Player = require('../models/player.model');
const RoomPlayer = require('../models/roomPlayer.model');
const cleanupService = require('../services/cleanup.service');
const { STATUS_CODES, VARIABLE } = require('../config/common.constant');

const router = express.Router();

// Get system statistics
router.get('/stats', async (req, res) => {
  try {
    const [roomCount, playerCount, roomPlayerCount] = await Promise.all([
      Room.count(),
      Player.count(),
      RoomPlayer.count()
    ]);

    const roomsByState = await Room.findAll({
      attributes: ['state', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
      group: ['state']
    });

    const stats = {
      totalRooms: roomCount,
      totalPlayers: playerCount,
      totalRoomPlayerAssociations: roomPlayerCount,
      roomsByState: roomsByState.reduce((acc, room) => {
        acc[room.state] = parseInt(room.dataValues.count);
        return acc;
      }, {}),
      maxRoomsLimit: cleanupService.maxRooms,
      scheduledCleanups: cleanupService.cleanupIntervals.size
    };

    res.status(STATUS_CODES.SUCCESS).json({
      [VARIABLE.STATUS]: VARIABLE.SUCCESS,
      [VARIABLE.DATA]: stats
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      [VARIABLE.STATUS]: VARIABLE.FAIL,
      [VARIABLE.MESSAGE]: 'Failed to get statistics'
    });
  }
});

// Manual cleanup trigger
router.post('/cleanup', async (req, res) => {
  try {
    await cleanupService.performPeriodicCleanup();
    
    res.status(STATUS_CODES.SUCCESS).json({
      [VARIABLE.STATUS]: VARIABLE.SUCCESS,
      [VARIABLE.MESSAGE]: 'Cleanup completed successfully'
    });
  } catch (error) {
    console.error('Error in manual cleanup:', error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      [VARIABLE.STATUS]: VARIABLE.FAIL,
      [VARIABLE.MESSAGE]: 'Cleanup failed'
    });
  }
});

// Force cleanup specific room
router.delete('/rooms/:code', async (req, res) => {
  try {
    const { code } = req.params;
    
    const room = await Room.findOne({ where: { code } });
    if (!room) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        [VARIABLE.STATUS]: VARIABLE.FAIL,
        [VARIABLE.MESSAGE]: 'Room not found'
      });
    }

    await cleanupService.deleteRoomData(room.id, room.code);
    
    res.status(STATUS_CODES.SUCCESS).json({
      [VARIABLE.STATUS]: VARIABLE.SUCCESS,
      [VARIABLE.MESSAGE]: `Room ${code} deleted successfully`
    });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      [VARIABLE.STATUS]: VARIABLE.FAIL,
      [VARIABLE.MESSAGE]: 'Failed to delete room'
    });
  }
});

module.exports = router;