// backend/src/services/cleanup.service.js
const { Op } = require('sequelize');
const Room = require('../models/room.model');
const Player = require('../models/player.model');
const RoomPlayer = require('../models/roomPlayer.model');
const { ROOM_STATE } = require('../config/common.constant');

class CleanupService {
  constructor() {
    this.cleanupIntervals = new Map();
    this.maxRooms = process.env.MAX_ROOMS || 100;
    this.gameCompletionDelay = 5 * 60 * 1000; // 5 minutes after game completion
    this.lobbyIdleTimeout = 30 * 60 * 1000; // 30 minutes for idle lobbies
    this.finishedRoomTimeout = 2 * 60 * 1000; // 2 minutes for finished rooms
  }

  // Schedule cleanup for a specific room
  scheduleRoomCleanup(roomId, roomCode, delay = this.gameCompletionDelay) {
    // Clear existing cleanup if any
    if (this.cleanupIntervals.has(roomId)) {
      clearTimeout(this.cleanupIntervals.get(roomId));
    }

    const timeoutId = setTimeout(async () => {
      try {
        await this.deleteRoomData(roomId, roomCode);
        this.cleanupIntervals.delete(roomId);
      } catch (error) {
        console.error(`Failed to cleanup room ${roomCode}:`, error);
      }
    }, delay);

    this.cleanupIntervals.set(roomId, timeoutId);
    console.log(`Scheduled cleanup for room ${roomCode} in ${delay}ms`);
  }

  // Cancel scheduled cleanup (if game is still ongoing)
  cancelRoomCleanup(roomId) {
    if (this.cleanupIntervals.has(roomId)) {
      clearTimeout(this.cleanupIntervals.get(roomId));
      this.cleanupIntervals.delete(roomId);
      console.log(`Cancelled cleanup for room ${roomId}`);
    }
  }

  // Delete specific room and associated data
  async deleteRoomData(roomId, roomCode) {
    try {
      // Get room with players
      const room = await Room.findByPk(roomId, { 
        include: ['players'] 
      });

      if (!room) {
        console.log(`Room ${roomCode} already deleted`);
        return;
      }

      // Get player IDs before deletion
      const playerIds = room.players.map(p => p.id);

      // Delete room-player associations
      await RoomPlayer.destroy({
        where: { roomId: roomId }
      });

      // Delete the room
      await Room.destroy({
        where: { id: roomId }
      });

      // Delete orphaned players (players not in any other room)
      for (const playerId of playerIds) {
        const otherRoomAssociations = await RoomPlayer.count({
          where: { playerId: playerId }
        });

        if (otherRoomAssociations === 0) {
          await Player.destroy({
            where: { id: playerId }
          });
        }
      }

      console.log(`Successfully cleaned up room ${roomCode} and ${playerIds.length} players`);
    } catch (error) {
      console.error(`Error cleaning up room ${roomCode}:`, error);
      throw error;
    }
  }

  // Periodic cleanup of old data
  async performPeriodicCleanup() {
    try {
      const now = new Date();
      
      // Clean finished rooms older than timeout
      const oldFinishedRooms = await Room.findAll({
        where: {
          state: ROOM_STATE.FINISHED,
          updatedAt: {
            [Op.lt]: new Date(now.getTime() - this.finishedRoomTimeout)
          }
        }
      });

      for (const room of oldFinishedRooms) {
        await this.deleteRoomData(room.id, room.code);
      }

      // Clean idle lobby rooms
      const idleLobbyRooms = await Room.findAll({
        where: {
          state: ROOM_STATE.LOBBY,
          updatedAt: {
            [Op.lt]: new Date(now.getTime() - this.lobbyIdleTimeout)
          }
        }
      });

      for (const room of idleLobbyRooms) {
        await this.deleteRoomData(room.id, room.code);
      }

      // Enforce max rooms limit
      await this.enforceRoomLimit();

      console.log(`Periodic cleanup completed. Removed ${oldFinishedRooms.length + idleLobbyRooms.length} rooms`);
    } catch (error) {
      console.error('Error in periodic cleanup:', error);
    }
  }

  // Enforce maximum number of rooms
  async enforceRoomLimit() {
    try {
      const roomCount = await Room.count();
      
      if (roomCount > this.maxRooms) {
        const excessCount = roomCount - this.maxRooms;
        
        // Delete oldest finished rooms first
        const oldestFinishedRooms = await Room.findAll({
          where: { state: ROOM_STATE.FINISHED },
          order: [['updatedAt', 'ASC']],
          limit: excessCount
        });

        let deletedCount = 0;
        for (const room of oldestFinishedRooms) {
          await this.deleteRoomData(room.id, room.code);
          deletedCount++;
        }

        // If still over limit, delete oldest lobby rooms
        if (deletedCount < excessCount) {
          const remaining = excessCount - deletedCount;
          const oldestLobbyRooms = await Room.findAll({
            where: { state: ROOM_STATE.LOBBY },
            order: [['updatedAt', 'ASC']],
            limit: remaining
          });

          for (const room of oldestLobbyRooms) {
            await this.deleteRoomData(room.id, room.code);
          }
        }

        console.log(`Enforced room limit: deleted ${excessCount} excess rooms`);
      }
    } catch (error) {
      console.error('Error enforcing room limit:', error);
    }
  }

  // Start periodic cleanup
  startPeriodicCleanup(intervalMs = 10 * 60 * 1000) { // 10 minutes
    setInterval(() => {
      this.performPeriodicCleanup();
    }, intervalMs);
    
    console.log(`Started periodic cleanup every ${intervalMs}ms`);
  }

  // Cleanup on server shutdown
  async shutdown() {
    // Clear all scheduled timeouts
    for (const timeoutId of this.cleanupIntervals.values()) {
      clearTimeout(timeoutId);
    }
    this.cleanupIntervals.clear();
    
    // Final cleanup
    await this.performPeriodicCleanup();
  }
}

module.exports = new CleanupService();