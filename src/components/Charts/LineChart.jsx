import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './Charts.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const LineChart = ({ stats }) => {
  // Early return if no data
  if (!stats || stats.length < 2) {
    return <div className="no-data">Not enough data to display chart</div>;
  }

  try {
    const homeTeam = stats[0];
    const awayTeam = stats[1];

    // Validate team data
    if (!homeTeam?.team?.name || !awayTeam?.team?.name) {
      return <div className="no-data">Invalid team data</div>;
    }

    const statTypes = ['Shots on Goal', 'Total Shots', 'Possession', 'Passes', 'Fouls'];
    
    const homeValues = statTypes.map(type => {
      const stat = homeTeam.statistics?.find(s => s.type === type);
      return stat ? (typeof stat.value === 'string' ? parseFloat(stat.value) || 0 : stat.value || 0) : 0;
    });

    const awayValues = statTypes.map(type => {
      const stat = awayTeam.statistics?.find(s => s.type === type);
      return stat ? (typeof stat.value === 'string' ? parseFloat(stat.value) || 0 : stat.value || 0) : 0;
    });

    const chartData = {
      labels: statTypes,
      datasets: [
        {
          label: homeTeam.team.name,
          data: homeValues,
          borderColor: 'rgb(37, 99, 235)',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: 'rgb(37, 99, 235)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        },
        {
          label: awayTeam.team.name,
          data: awayValues,
          borderColor: 'rgb(124, 58, 237)',
          backgroundColor: 'rgba(124, 58, 237, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: 'rgb(124, 58, 237)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 14,
              weight: 'bold'
            },
            padding: 20,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        title: {
          display: true,
          text: 'Team Statistics Comparison',
          font: {
            size: 18,
            weight: 'bold'
          },
          padding: {
            top: 10,
            bottom: 30
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 13
          },
          borderColor: '#ddd',
          borderWidth: 1,
          displayColors: true,
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              label += context.parsed.y;
              if (context.label === 'Possession') {
                label += '%';
              }
              return label;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
          },
          ticks: {
            font: {
              size: 12
            }
          }
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 12
            }
          }
        }
      },
      interaction: {
        mode: 'index',
        intersect: false,
      }
    };

    return (
      <div className="chart-wrapper">
        <div className="chart-container">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('LineChart error:', error);
    return <div className="no-data">Error rendering chart: {error.message}</div>;
  }
};

export default LineChart;