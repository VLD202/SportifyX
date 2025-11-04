import React, { useState } from 'react';
import { getMatchStatus, getStatusBadgeClass, formatTime } from '../../utils/helper';
import PlayerStats from '../PlayerStats/PlayerStats';

const MatchCard = ({ match }) => {
  const [showDetails, setShowDetails] = useState(false);

  const { fixture, teams, goals, league, score } = match;
  const status = fixture.status.short;
  const elapsed = fixture.status.elapsed;

  const pulseClass = status === 'LIVE' || status === '1H' || status === '2H' ? 'animate-pulse' : '';

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
      <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-200">
        <div className="flex items-center gap-2">
          <img
            src={league.logo}
            alt={league.name}
            className="w-6 h-6 object-contain"
            onError={(e) => (e.target.style.display = 'none')}
          />
          <span className="text-sm text-gray-500 font-medium">{league.name}</span>
        </div>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusBadgeClass(status)} ${pulseClass}`}
        >
          {getMatchStatus(status)} {elapsed && `${elapsed}'`}
        </span>
      </div>

      <div className="grid grid-cols-3 items-center gap-6 mb-6">
        <div className="flex flex-col items-center gap-1">
          <img
            src={teams.home.logo}
            alt={teams.home.name}
            className="w-16 h-16 object-contain transition-transform duration-200 hover:scale-110"
            onError={(e) => (e.target.src = 'https://via.placeholder.com/80?text=Team')}
          />
          <h3 className="text-base font-semibold text-gray-800 text-center truncate max-w-[120px]">
            {teams.home.name}
          </h3>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-4 text-4xl font-bold text-blue-600">
            <span className="min-w-[40px] text-center">{goals.home ?? 0}</span>
            <span className="text-gray-500 font-normal">-</span>
            <span className="min-w-[40px] text-center">{goals.away ?? 0}</span>
          </div>
          {status === 'HT' && (
            <div className="text-sm text-gray-500 mt-1">
              HT: {score.halftime.home} - {score.halftime.away}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-1">
          <img
            src={teams.away.logo}
            alt={teams.away.name}
            className="w-16 h-16 object-contain transition-transform duration-200 hover:scale-110"
            onError={(e) => (e.target.src = 'https://via.placeholder.com/80?text=Team')}
          />
          <h3 className="text-base font-semibold text-gray-800 text-center truncate max-w-[120px]">
            {teams.away.name}
          </h3>
        </div>
      </div>

      <div className="bg-gray-50 rounded-md p-4 mb-4">
        <div className="flex justify-between items-center py-1 text-sm">
          <span className="text-gray-500 font-medium">🏟️ Venue:</span>
          <span className="text-gray-800 font-semibold">{fixture.venue.name}</span>
        </div>
        <div className="flex justify-between items-center py-1 text-sm">
          <span className="text-gray-500 font-medium">🕐 Time:</span>
          <span className="text-gray-800 font-semibold">{formatTime(fixture.date)}</span>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? '📊 Hide Details' : '📊 View Details'}
        </button>
      </div>

      {showDetails && <PlayerStats matchId={fixture.id} />}
    </div>
  );
};

export default MatchCard;