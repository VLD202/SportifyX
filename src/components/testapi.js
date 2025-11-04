// src/components/TestAPI.js

import React, { useState, useEffect } from 'react';
import { fetchFromAPI } from '../config/api';

function TestAPI() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Jab component load ho, data fetch karo
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Apna endpoint yahan dalo - example: '/api/teams'
        const result = await fetchFromAPI('/api/test');
        
        setData(result);
        setError(null);
      } catch (err) {
        setError('Backend se data nahi aa raha. Check karo backend chal raha hai!');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Loading state
  if (loading) {
    return <div>Loading... ⏳</div>;
  }

  // Error state
  if (error) {
    return (
      <div style={{ color: 'red' }}>
        <h3>❌ Error:</h3>
        <p>{error}</p>
      </div>
    );
  }

  // Success state
  return (
    <div>
      <h2>✅ Backend Connected!</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default TestAPI;