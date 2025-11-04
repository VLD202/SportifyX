import React, { useState } from 'react';
import './MatchCard.css';
import { getMatchStatus, getStatusBadgeClass, formatTime } from '../../utils/helper';
import PlayerStats from '../PlayerStats/PlayerStats';

const MatchCard = ({ match }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const { fixture, teams, goals, league, score } = match;
  const status = fixture.status.short;
  const elapsed = fixture.status.elapsed;

  return (
    <div className="match-card">
      <div className="match-header">
        <div className="league-info">
          <img 
            src={league.logo} 
            alt={league.name} 
            className="league-logo"
            onError={(e) => e.target.style.display = 'none'}
          />
          <span className="league-name">{league.name}</span>
        </div>
        <span className={`badge ${getStatusBadgeClass(status)}`}>
          {getMatchStatus(status)}
          {elapsed && ` ${elapsed}'`}
        </span>
      </div>

      <div className="match-content">
        <div className="team home-team">
          <img 
            src={teams.home.logo} 
            alt={teams.home.name}
            className="team-logo"
            onError={(e) => e.target.src = 'https://via.placeholder.com/80?text=Team'}
          />
          <h3>{teams.home.name}</h3>
        </div>

        <div className="match-score">
          <div className="score-display">
            <span className="score">{goals.home ?? 0}</span>
            <span className="separator">-</span>
            <span className="score">{goals.away ?? 0}</span>
          </div>
          {status === 'HT' && (
            <div className="halftime-score">
              HT: {score.halftime.home} - {score.halftime.away}
            </div>
          )}
        </div>

        <div className="team away-team">
          <img 
            src={teams.away.logo} 
            alt={teams.away.name}
            className="team-logo"
            onError={(e) => e.target.src = 'https://via.placeholder.com/80?text=Team'}
          />
          <h3>{teams.away.name}</h3>
        </div>
      </div>

      <div className="match-info">
        <div className="info-item">
          <span className="info-label">🏟️ Venue:</span>
          <span className="info-value">{fixture.venue.name}</span>
        </div>
        <div className="info-item">
          <span className="info-label">🕐 Time:</span>
          <span className="info-value">{formatTime(fixture.date)}</span>
        </div>
      </div>

      <div className="match-actions">
        <button 
          className="btn btn-primary btn-sm"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? '📊 Hide Details' : '📊 View Details'}
        </button>
      </div>

      {showDetails && (
        <PlayerStats matchId={fixture.id} />
      )}
    </div>
  );
};

export default MatchCard;