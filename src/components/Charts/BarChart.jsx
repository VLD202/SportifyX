import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './Charts.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ stats }) => {
  if (!stats || stats.length < 2) {
    return <div className="no-data">Not enough data to display chart</div>;
  }

  const homeTeam = stats[0];
  const awayTeam = stats[1];

  const statTypes = ['Shots on Goal', 'Total Shots', 'Corners', 'Offsides', 'Fouls'];
  
  const homeValues = statTypes.map(type => {
    const stat = homeTeam.statistics.find(s => s.type === type);
    return stat ? (typeof stat.value === 'string' ? parseFloat(stat.value) : stat.value) : 0;
  });

  const awayValues = statTypes.map(type => {
    const stat = awayTeam.statistics.find(s => s.type === type);
    return stat ? (typeof stat.value === 'string' ? parseFloat(stat.value) : stat.value) : 0;
  });

  const data = {
    labels: statTypes,
    datasets: [
      {
        label: homeTeam.team.name,
        data: homeValues,
        backgroundColor: 'rgba(37, 99, 235, 0.8)',
        borderColor: 'rgb(37, 99, 235)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: awayTeam.team.name,
        data: awayValues,
        backgroundColor: 'rgba(124, 58, 237, 0.8)',
        borderColor: 'rgb(124, 58, 237)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
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
          pointStyle: 'rect'
        }
      },
      title: {
        display: true,
        text: 'Match Statistics Overview',
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
    }
  };

  return (
    <div className="chart-wrapper">
      <div className="chart-container">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default BarChart;
````