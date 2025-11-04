import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import MatchCard from '../MatchCard/MatchCard';
import socketService from '../../services/socketservices';
import { apiService } from '../../services/apiServices';

const Dashboard = () => {
  const [liveMatches, setLiveMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    // Connect to WebSocket
    socketService.connect();

    // Fetch initial data
    fetchLiveMatches();

    // Listen for real-time updates
    socketService.on('liveMatchesUpdate', (matches) => {
      console.log('Received live matches update:', matches);
      setLiveMatches(matches);
      setLastUpdate(new Date());
    });

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchLiveMatches();
    }, 30000);

    return () => {
      clearInterval(interval);
      socketService.disconnect();
    };
  }, []);

  const fetchLiveMatches = async () => {
    try {
      setError(null);
      const response = await apiService.getLiveMatches();
      
      if (response.success) {
        setLiveMatches(response.data);
        setLastUpdate(new Date());
      }
    } catch (err) {
      console.error('Error fetching live matches:', err);
      setError('Failed to fetch live matches. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchLiveMatches();
  };

  if (loading && liveMatches.length === 0) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading live matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>⚽ Live Sports Analytics Dashboard</h1>
          <p className="subtitle">Real-time match data and statistics</p>
        </div>
        
        <div className="header-actions">
          <div className="last-update">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
          <button className="btn btn-primary" onClick={handleRefresh} disabled={loading}>
            {loading ? '🔄 Refreshing...' : '🔄 Refresh'}
          </button>
        </div>
      </header>

      {error && (
        <div className="error-message">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-value">{liveMatches.length}</div>
          <div className="stat-label">Live Matches</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {liveMatches.filter(m => m.fixture.status.short === '1H' || m.fixture.status.short === '2H').length}
          </div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {liveMatches.filter(m => m.fixture.status.short === 'HT').length}
          </div>
          <div className="stat-label">Half Time</div>
        </div>
      </div>

      <div className="matches-section">
        <h2>🔴 Live Matches</h2>
        
        {liveMatches.length === 0 ? (
          <div className="no-matches">
            <p>No live matches at the moment</p>
            <button className="btn btn-secondary" onClick={handleRefresh}>
              Check Again
            </button>
          </div>
        ) : (
          <div className="matches-grid">
            {liveMatches.map((match) => (
              <MatchCard 
                key={match.fixture.id} 
                match={match}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;