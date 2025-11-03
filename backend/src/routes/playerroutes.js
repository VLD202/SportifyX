const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playercontroller');

router.get('/:playerId', playerController.getPlayerInfo);
router.get('/:playerId/stats', playerController.getPlayerStats);

module.exports = router;