import React, { useState, useEffect } from 'react';
import MatchCard from '../MatchCard/MatchCard';
import socketService from '../../services/socketservices';
import { apiService } from '../../services/apiServices';

const Dashboard = () => {
  const [liveMatches, setLiveMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const fetchLiveMatches = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.getLiveMatches();
      const matches = response?.data || response || [];
      setLiveMatches(Array.isArray(matches) ? matches : []);
      setLastUpdate(new Date());
      console.log('Fetched matches:', matches.length);
    } catch (err) {
      console.error('Error fetching live matches:', err);
      const msg = err.response?.data?.error || err.message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveMatches();
    socketService.connect();

    const handleLiveMatchesUpdate = (updatedMatches) => {
      console.log('Live update:', updatedMatches);
      setLiveMatches(Array.isArray(updatedMatches) ? updatedMatches : []);
      setLastUpdate(new Date());
    };

    socketService.onLiveMatchesUpdate(handleLiveMatchesUpdate);

    const interval = setInterval(() => {
      if (!socketService.isConnected()) fetchLiveMatches();
    }, 60000);

    return () => {
      clearInterval(interval);
      socketService.off('liveMatchesUpdate', handleLiveMatchesUpdate);
      socketService.disconnect();
    };
  }, []);

  const handleRefresh = () => fetchLiveMatches();

  const inProgressCount = liveMatches.filter(
    m => m.fixture?.status?.short === '1H' || m.fixture?.status?.short === '2H'
  ).length;

  const halfTimeCount = liveMatches.filter(
    m => m.fixture?.status?.short === 'HT'
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-blue-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        <div className="bg-gradient-to-r from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl p-6 md:p-8 mb-6 border border-slate-700/50">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Live Sports Analytics
                </h1>
                <p className="text-slate-400 mt-1">Real-time match data</p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${socketService.isConnected() ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <p className="text-slate-400 text-sm">
                  {socketService.isConnected() ? 'Live' : 'Offline'}
                </p>
              </div>
              <p className="text-slate-400 text-sm">Last updated</p>
              <p className="text-cyan-400 text-xl font-semibold">{lastUpdate.toLocaleTimeString()}</p>
              <button 
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded-xl transition-all"
                onClick={handleRefresh}
                disabled={loading}
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 flex justify-between items-center">
            <span>⚠️ {error}</span>
            <button className="text-xl hover:text-red-300" onClick={() => setError(null)}>✕</button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50">
            <p className="text-slate-400">Live Matches</p>
            <p className="text-5xl font-bold text-cyan-400">{liveMatches.length}</p>
          </div>
          <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50">
            <p className="text-slate-400">In Progress</p>
            <p className="text-5xl font-bold text-purple-400">{inProgressCount}</p>
          </div>
          <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50">
            <p className="text-slate-400">Half Time</p>
            <p className="text-5xl font-bold text-orange-400">{halfTimeCount}</p>
          </div>
        </div>

        <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50">
          <h2 className="text-2xl font-semibold text-slate-200 mb-6 flex items-center gap-2">
            🔴 Live Matches
          </h2>

          {loading && liveMatches.length === 0 ? (
            <p className="text-center text-slate-300 py-10">Loading matches...</p>
          ) : liveMatches.length === 0 ? (
            <p className="text-center text-slate-300 py-10">No live matches right now</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {liveMatches.map(match => (
                <MatchCard key={match.fixture.id} match={match} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
