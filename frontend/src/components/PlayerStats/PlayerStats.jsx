import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiServices';
import LineChart from '../Charts/LineChart';

// ✅ Tailwind version of PlayerStats.jsx (no external CSS)
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

      if (statsResponse.success) setStats(statsResponse.data);
      if (eventsResponse.success) setEvents(eventsResponse.data);
    } catch (error) {
      console.error('Error fetching match data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-10 border-t border-gray-200 pt-10 flex justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-blue-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="mt-10 border-t border-gray-200 pt-10">
      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-gray-200 overflow-x-auto">
        {['stats', 'events', 'charts'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 text-sm font-medium transition border-b-2 whitespace-nowrap
              ${activeTab === tab
                ? 'text-blue-600 border-blue-600 bg-blue-50'
                : 'text-gray-500 border-transparent hover:bg-gray-100'}`}
          >
            {tab === 'stats' && '📊 Statistics'}
            {tab === 'events' && '⚡ Events'}
            {tab === 'charts' && '📈 Charts'}
          </button>
        ))}
      </div>

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stats.length === 0 ? (
            <p className="text-center text-gray-500 text-lg py-10">No statistics available yet</p>
          ) : (
            stats.map((teamStat, index) => (
              <div key={index} className="bg-white p-5 rounded-xl shadow-sm border">
                <h4 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b">{teamStat.team.name}</h4>
                <div className="flex flex-col gap-4">
                  {teamStat.statistics.map((stat, idx) => (
                    <div key={idx} className="grid grid-cols-[120px_1fr_50px] items-center gap-2 text-sm">
                      <span className="text-gray-500 font-medium">{stat.type}</span>

                      {/* Bar */}
                      <div className="h-6 bg-gray-100 rounded-md overflow-hidden">
                        <div
                          className={`h-full rounded-md transition-all duration-300 ${index === 0 ? 'bg-blue-600' : 'bg-green-600'}`}
                          style={{ width: `${stat.value || 0}%` }}
                        ></div>
                      </div>

                      <span className="text-gray-800 font-semibold text-right">{stat.value || 0}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
          {events.length === 0 ? (
            <p className="text-center text-gray-500 text-lg py-10">No events recorded yet</p>
          ) : (
            events.map((event, index) => (
              <div
                key={index}
                className="grid grid-cols-[60px_40px_1fr] gap-4 p-4 bg-gray-100 rounded-lg border-l-4 border-blue-600 transition hover:bg-white hover:shadow-md hover:translate-x-1"
              >
                <div className="text-lg font-bold text-blue-600 flex items-center">{event.time.elapsed}'</div>
                <div className="text-2xl flex items-center justify-center">
                  {event.type === 'Goal' && '⚽'}
                  {event.type === 'Card' && (event.detail === 'Yellow Card' ? '🟨' : '🟥')}
                  {event.type === 'subst' && '🔄'}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-gray-800 font-semibold">{event.player.name}</div>
                  <div className="text-gray-500 text-sm">{event.detail}</div>
                  <div className="text-blue-600 font-medium text-sm">{event.team.name}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Charts Tab */}
      {activeTab === 'charts' && (
        <div className="p-6 bg-gray-100 rounded-xl">
          {stats.length >= 2 ? (
            <LineChart stats={stats} />
          ) : (
            <p className="text-center text-gray-500 text-lg py-10">Insufficient data for charts</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerStats;