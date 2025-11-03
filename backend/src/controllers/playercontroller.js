const pool = require('../config/database');
const sportsApiService = require('../services/sportsApiService');

class PlayerController {
  async getPlayerInfo(req, res) {
    try {
      const { playerId } = req.params;
      const player = await sportsApiService.getPlayerInfo(playerId);
      
      res.json({ success: true, data: player });
    } catch (error) {
      console.error('Error in getPlayerInfo:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getPlayerStats(req, res) {
    try {
      const { playerId } = req.params;
      const stats = await sportsApiService.getPlayerStats(playerId);
      
      res.json({ success: true, data: stats });
    } catch (error) {
      console.error('Error in getPlayerStats:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new PlayerController();