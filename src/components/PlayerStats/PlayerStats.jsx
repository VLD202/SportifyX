import React, { useState, useEffect } from 'react';
import './PlayerStats.css';
import { apiService } from '../../services/apiServices';
import LineChart from '../Charts/LineChart';

const PlayerStats = ({ matchId }) => {
  const [stats, setStats] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    fetchMatchData();
  }, [matchId]);

  const fetchMatchData = async () => {
    try {
      setLoading(true);
      const [statsResponse, eventsResponse] = await Promise.all([
        apiService.getMatchStats(matchId),
        apiService.getMatchEvents(matchId)
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
      if (eventsResponse.success) {
        setEvents(eventsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching match data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="player-stats-container">
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="player-stats-container">
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📊 Statistics
        </button>
        <button
          className={`tab ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          ⚡ Events
        </button>
        <button
          className={`tab ${activeTab === 'charts' ? 'active' : ''}`}
          onClick={() => setActiveTab('charts')}
        >
          📈 Charts
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'stats' && (
          <div className="stats-grid">
            {stats.length === 0 ? (
              <p className="no-data">No statistics available yet</p>
            ) : (
              stats.map((teamStat, index) => (
                <div key={index} className="team-stats-card">
                  <h4>{teamStat.team.name}</h4>
                  <div className="stats-list">
                    {teamStat.statistics.map((stat, idx) => (
                      <div key={idx} className="stat-row">
                        <span className="stat-label">{stat.type}</span>
                        <div className="stat-bar-container">
                          <div 
                            className="stat-bar"
                            style={{ 
                              width: `${stat.value || 0}%`,
                              backgroundColor: index === 0 ? 'var(--primary-color)' : 'var(--secondary-color)'
                            }}
                          ></div>
                        </div>
                        <span className="stat-value">{stat.value || 0}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="events-timeline">
            {events.length === 0 ? (
              <p className="no-data">No events recorded yet</p>
            ) : (
              events.map((event, index) => (
                <div key={index} className="event-item">
                  <div className="event-time">{event.time.elapsed}'</div>
                  <div className="event-icon">
                    {event.type === 'Goal' && '⚽'}
                    {event.type === 'Card' && (event.detail === 'Yellow Card' ? '🟨' : '🟥')}
                    {event.type === 'subst' && '🔄'}
                  </div>
                  <div className="event-details">
                    <div className="event-player">{event.player.name}</div>
                    <div className="event-type">{event.detail}</div>
                    <div className="event-team">{event.team.name}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'charts' && (
          <div className="charts-container">
            {stats.length >= 2 ? (
              <LineChart stats={stats} />
            ) : (
              <p className="no-data">Insufficient data for charts</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerStats;
