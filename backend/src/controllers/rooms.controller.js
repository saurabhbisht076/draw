const { createRoomService, joinRoomService, getRoomService, leaveRoomService, updateRoomSettingsService, startGameService} = require('../services/rooms.service');
const commonConstant = require('../config/common.constant');
const { createRoomSchema } = require('../utils/vaildators');

async function createRoomController(req, res){
    try{

        const {playerName} = req.body;
        if(!playerName) return res.status(commonConstant.STATUS_CODES.SUCCESS).json({error: 'PlayerName is required'});
        const{ room, player, isHost} = await createRoomService(playerName);
        
        return res.status(commonConstant.STATUS_CODES.CREATED).json({
            roomCode: room.code,
            roomId: room.id,
            hostId: room.hostId,
            player:{
                id: player.id,
                name: player.name,
                isHost
            },
            settings:room.settings,
            state:room.state
        });
    }catch(err){
        console.error('Error creating room:', err);
        return res.status(commonConstant.STATUS_CODES.SERVER_ERROR).json({error:'Failed to create room'});
    }
}
async function joinRoomController(req, res){
    try{
        const io = req.app.get('io');
        const {code} = req.params;
        const {playerName} = req.body;
        const {error} = createRoomSchema.validate({playerName});
        if(error) return res.status(commonConstant.STATUS_CODES.BAD_REQUEST).json({[commonConstant.VARIABLE.STATUS]: commonConstant.VARIABLE.FAIL,[commonConstant.VARIABLE.MESSAGE]:error.details[0].message});
        if(!playerName) return res.status(commonConstant.STATUS_CODES.BAD_REQUEST).json({[commonConstant.VARIABLE.STATUS]: commonConstant.VARIABLE.FAIL,[commonConstant.VARIABLE.MESSAGE]:'PlayerName is required'});
        const {room, player} = await joinRoomService(code, playerName, io);
        return res.status(commonConstant.STATUS_CODES.SUCCESS).json({
            [commonConstant.VARIABLE.STATUS]: commonConstant.VARIABLE.SUCCESS,
            [commonConstant.VARIABLE.MESSAGE]:commonConstant.MESSAGES.SUCCESS,
            [commonConstant.VARIABLE.DATA]:{
                roomCode: room.code,
                roomId: room.id,
                hostId: room.hostId,
                player:{
                    id: player.id,  
                    name: player.name
                },
                settings: room.settings,
                state: room.state,
                players:room.players.map(p => ({
                    id: p.id,
                    name: p.name
            }))
            }
        });
    }
     catch(err){
        console.error('Error joining room:', err);
        const status = err.status || commonConstant.STATUS_CODES.SERVER_ERROR;
        return res.status(status).json({[commonConstant.VARIABLE.STATUS]: commonConstant.VARIABLE.FAIL,[commonConstant.VARIABLE.MESSAGE]:err.message || 'Failed to join room'});
    }

}
async function getRoomController(req, res){
    try{
        const io = req.app.get('io');
        const {code} = req.params;
        const room = await getRoomService(code);
        return res.status(commonConstant.STATUS_CODES.SUCCESS).json({
            [commonConstant.VARIABLE.STATUS]: commonConstant.VARIABLE.SUCCESS,
            [commonConstant.VARIABLE.MESSAGE]: commonConstant.MESSAGES.SUCCESS,
            [commonConstant.VARIABLE.DATA]: {
                roomCode: room.code,
                roomId: room.id,
                hostId: room.hostId,
                settings: room.settings,
                state: room.state,
                players: room.players.map(p => ({
                    id: p.id,
                    name: p.name 
                }))
            }
        });
    }   catch(err){ 
        console.error('Error fetching room:', err);
        const status = err.status || commonConstant.STATUS_CODES.SERVER_ERROR;
        return res.status(status).json({[commonConstant.VARIABLE.STATUS]: commonConstant.VARIABLE.FAIL,[commonConstant.VARIABLE.MESSAGE]:err.message || 'Failed to fetch room'});
    }   
}
async function leaveRoomController(req, res) {
  try {
    const io = req.app.get('io');
    const { code } = req.params;
    const { playerId } = req.body;

    const room = await leaveRoomService(code, playerId, io);

    return res.status(commonConstant.STATUS_CODES.SUCCESS).json({
      [commonConstant.VARIABLE.STATUS]: commonConstant.VARIABLE.SUCCESS,
      [commonConstant.VARIABLE.MESSAGE]: commonConstant.MESSAGES.SUCCESS,
      [commonConstant.VARIABLE.DATA]: {
        roomCode: room.code,
        roomId: room.id,
        hostId: room.hostId,
        state: room.state,
        players: room.players.map(p => ({ id: p.id, name: p.name }))
      }
    });
  } catch (err) {
    console.error('Error leaving room:', err);
    const status = err.status || commonConstant.STATUS_CODES.SERVER_ERROR;
    return res.status(status).json({
      [commonConstant.VARIABLE.STATUS]: commonConstant.VARIABLE.FAIL,
      [commonConstant.VARIABLE.MESSAGE]: err.message || 'Failed to leave room'
    });
  }
}

async function updateRoomSettingsController(req, res) {
  try {
    const io = req.app.get('io');
    const { code } = req.params;
    const { playerId, settings } = req.body;

    const room = await updateRoomSettingsService(code, playerId, settings, io);

    return res.status(commonConstant.STATUS_CODES.SUCCESS).json({
      [commonConstant.VARIABLE.STATUS]: commonConstant.VARIABLE.SUCCESS,
      [commonConstant.VARIABLE.MESSAGE]: commonConstant.MESSAGES.SUCCESS,
      [commonConstant.VARIABLE.DATA]: {
        roomCode: room.code,
        roomId: room.id,
        settings: room.settings,
      }
    });
  } catch (err) {
    console.error('Error updating settings:', err);
    const status = err.status || commonConstant.STATUS_CODES.SERVER_ERROR;
    return res.status(status).json({
      [commonConstant.VARIABLE.STATUS]: commonConstant.VARIABLE.FAIL,
      [commonConstant.VARIABLE.MESSAGE]: err.message || 'Failed to update settings'
    });
  }
}

async function startGameController(req, res) {
  try {
    const io = req.app.get('io'); 
    const { code } = req.params;
    const { playerId } = req.body;

    const room = await startGameService(code, playerId, io);

    return res.status(commonConstant.STATUS_CODES.SUCCESS).json({
      [commonConstant.VARIABLE.STATUS]: commonConstant.VARIABLE.SUCCESS,
      [commonConstant.VARIABLE.MESSAGE]: commonConstant.MESSAGES.SUCCESS,
      [commonConstant.VARIABLE.DATA]: {
        roomCode: room.code,
        roomId: room.id,
        state: room.state
      }
    });
  } catch (err) {
    console.error('Error starting game:', err);
    const status = err.status || commonConstant.STATUS_CODES.SERVER_ERROR;
    return res.status(status).json({
      [commonConstant.VARIABLE.STATUS]: commonConstant.VARIABLE.FAIL,
      [commonConstant.VARIABLE.MESSAGE]: err.message || 'Failed to start game'
    });
  }
}

module.exports = {createRoomController, joinRoomController, getRoomController, leaveRoomController,
  updateRoomSettingsController,
  startGameController};