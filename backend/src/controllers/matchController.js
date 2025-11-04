const pool = require('../config/database');
const sportsApiService = require('../services/sportsApiService');

class MatchController {
  // Get all live matches
  async getLiveMatches(req, res) {
    try {
      const matches = await sportsApiService.getLiveMatches();
      
      // Store/update matches in database
      for (const match of matches) {
        await pool.query(
          `INSERT INTO matches (match_id, home_team, away_team, home_score, away_score, status, start_time, league, venue)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           ON CONFLICT (match_id) 
           DO UPDATE SET 
             home_score = $4,
             away_score = $5,
             status = $6,
             updated_at = CURRENT_TIMESTAMP`,
          [
            match.fixture.id,
            match.teams.home.name,
            match.teams.away.name,
            match.goals.home,
            match.goals.away,
            match.fixture.status.short,
            match.fixture.date,
            match.league.name,
            match.fixture.venue.name
          ]
        );
      }

      // Emit to WebSocket clients
      const io = req.app.get('socketio');
      io.emit('liveMatchesUpdate', matches);

      res.json({ success: true, data: matches });
    } catch (error) {
      console.error('Error in getLiveMatches:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get match by ID
  async getMatchById(req, res) {
    try {
      const { matchId } = req.params;
      const match = await sportsApiService.getMatchById(matchId);

      if (!match) {
        return res.status(404).json({ success: false, error: 'Match not found' });
      }

      res.json({ success: true, data: match });
    } catch (error) {
      console.error('Error in getMatchById:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get match statistics
  async getMatchStats(req, res) {
    try {
      const { matchId } = req.params;
      const stats = await sportsApiService.getMatchStatistics(matchId);

      res.json({ success: true, data: stats });
    } catch (error) {
      console.error('Error in getMatchStats:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get match events
  async getMatchEvents(req, res) {
    try {
      const { matchId } = req.params;
      const events = await sportsApiService.getMatchEvents(matchId);

      res.json({ success: true, data: events });
    } catch (error) {
      console.error('Error in getMatchEvents:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get matches from database
  async getStoredMatches(req, res) {
    try {
      const result = await pool.query(
        'SELECT * FROM matches ORDER BY start_time DESC LIMIT 20'
      );

      res.json({ success: true, data: result.rows });
    } catch (error) {
      console.error('Error in getStoredMatches:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new MatchController();