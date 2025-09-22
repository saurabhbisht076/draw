const Joi = require('joi');
const {PLAYER_ROLE} = require('../config/common.constant');

const createRoomSchema = Joi.object({
    playerName: Joi.string().min(1).max(50).required()
}); 
module.exports = { createRoomSchema };