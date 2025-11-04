// Format date and time
export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format time only
export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Get match status display
export const getMatchStatus = (status) => {
  const statusMap = {
    'TBD': 'To Be Determined',
    'NS': 'Not Started',
    '1H': 'First Half',
    'HT': 'Half Time',
    '2H': 'Second Half',
    'ET': 'Extra Time',
    'P': 'Penalties',
    'FT': 'Full Time',
    'AET': 'After Extra Time',
    'PEN': 'Penalties',
    'BT': 'Break Time',
    'SUSP': 'Suspended',
    'INT': 'Interrupted',
    'PST': 'Postponed',
    'CANC': 'Cancelled',
    'ABD': 'Abandoned',
    'AWD': 'Awarded',
    'WO': 'Walk Over',
    'LIVE': 'Live'
  };
  return statusMap[status] || status;
};

// Get status badge class
export const getStatusBadgeClass = (status) => {
  const liveStatuses = ['1H', '2H', 'ET', 'P', 'LIVE', 'HT', 'BT'];
  const finishedStatuses = ['FT', 'AET', 'PEN'];
  const cancelledStatuses = ['PST', 'CANC', 'ABD', 'SUSP'];

  if (liveStatuses.includes(status)) return 'badge-success';
  if (finishedStatuses.includes(status)) return 'badge-info';
  if (cancelledStatuses.includes(status)) return 'badge-danger';

  return 'badge-warning';
};

// Format percentage
export const formatPercentage = (value) => {
  return `${parseFloat(value).toFixed(1)}%`;
};

// Format number with commas
export const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Truncate text
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Get team logo URL (placeholder function)
export const getTeamLogoUrl = (teamName) => {
  // In production, this would return actual team logos
  return `https://via.placeholder.com/50?text=${encodeURIComponent(teamName.substring(0, 3))}`;
};

// Calculate possession percentage
export const calculatePossession = (homeStats, awayStats) => {
  const totalPasses = (homeStats?.passes || 0) + (awayStats?.passes || 0);
  if (totalPasses === 0) return { home: 50, away: 50 };

  const homePossession = ((homeStats?.passes || 0) / totalPasses) * 100;
  const awayPossession = 100 - homePossession;

  return {
    home: homePossession.toFixed(1),
    away: awayPossession.toFixed(1)
  };
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Check if match is live
export const isMatchLive = (status) => {
  const liveStatuses = ['1H', '2H', 'ET', 'P', 'HT', 'BT'];
  return liveStatuses.includes(status);
};

// Get event icon
export const getEventIcon = (eventType) => {
  const iconMap = {
    'Goal': '⚽',
    'Card': '🟨',
    'Subst': '🔄',
    'Var': '📺'
  };
  return iconMap[eventType] || '•';
};

// Format match score
export const formatScore = (homeScore, awayScore) => {
  return `${homeScore ?? 0} - ${awayScore ?? 0}`;
};
