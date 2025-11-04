const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

router.get('/live', matchController.getLiveMatches);
router.get('/stored', matchController.getStoredMatches);
router.get('/:matchId', matchController.getMatchById);
router.get('/:matchId/stats', matchController.getMatchStats);
router.get('/:matchId/events', matchController.getMatchEvents);

module.exports = router;