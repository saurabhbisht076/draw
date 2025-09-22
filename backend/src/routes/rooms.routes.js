const express = require('express');
const {createRoomController, joinRoomController, getRoomController, leaveRoomController, updateRoomSettingsController, startGameController} = require('../controllers/rooms.controller');
const router = express.Router();
router.post('/', createRoomController);
router.post('/:code/join', joinRoomController);
router.get('/:code', getRoomController);
router.post('/:code/leave', leaveRoomController);
router.post('/:code/settings',updateRoomSettingsController);
router.post('/:code/start', startGameController);

module.exports = router;