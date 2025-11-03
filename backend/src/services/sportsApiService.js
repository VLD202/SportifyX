const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.SPORTS_API_KEY;
const BASE_URL = 'https://v3.football.api-sports.io';

class SportsApiService {
  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        'x-apisports-key': API_KEY
      }
    });
  }

  async getLiveMatches() {
    try {
      const response = await this.client.get('/fixtures', {
        params: {
          live: 'all'
        }
      });
      return response.data.response;
    } catch (error) {
      console.error('Error fetching live matches:', error.message);
      throw error;
    }
  }

  async getMatchById(matchId) {
    try {
      const response = await this.client.get('/fixtures', {
        params: {
          id: matchId
        }
      });
      return response.data.response[0];
    } catch (error) {
      console.error('Error fetching match by ID:', error.message);
      throw error;
    }
  }

  async getMatchStatistics(matchId) {
    try {
      const response = await this.client.get('/fixtures/statistics', {
        params: {
          fixture: matchId
        }
      });
      return response.data.response;
    } catch (error) {
      console.error('Error fetching match statistics:', error.message);
      throw error;
    }
  }

  async getMatchEvents(matchId) {
    try {
      const response = await this.client.get('/fixtures/events', {
        params: {
          fixture: matchId
        }
      });
      return response.data.response;
    } catch (error) {
      console.error('Error fetching match events:', error.message);
      throw error;
    }
  }

  async getPlayerInfo(playerId) {
    try {
      const response = await this.client.get('/players', {
        params: {
          id: playerId,
          season: new Date().getFullYear()
        }
      });
      return response.data.response[0];
    } catch (error) {
      console.error('Error fetching player info:', error.message);
      throw error;
    }
  }

  async getPlayerStats(playerId) {
    try {
      const response = await this.client.get('/players', {
        params: {
          id: playerId,
          season: new Date().getFullYear()
        }
      });
      return response.data.response[0]?.statistics || [];
    } catch (error) {
      console.error('Error fetching player stats:', error.message);
      throw error;
    }
  }
}

module.exports = new SportsApiService();