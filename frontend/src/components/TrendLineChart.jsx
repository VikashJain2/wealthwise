import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TrendLineChart = ({ data }) => {
  const hasData = data && data.length > 0;

  const months = hasData ? [...new Set(data.map(d => d.month))] : [];

  const expenses = months.map(
    m => parseFloat(data.find(d => d.month === m && d.type === "expense")?.total || 0)
  );
  const incomes = months.map(
    m => parseFloat(data.find(d => d.month === m && d.type === "income")?.total || 0)
  );

  const chartData = {
    labels: hasData ? months : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: "Expenses",
        data: hasData ? expenses : [0, 0, 0, 0, 0, 0],
        borderColor: "#ef4444", // red
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#ef4444",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Income",
        data: hasData ? incomes : [0, 0, 0, 0, 0, 0],
        borderColor: "#22c55e", // green
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#22c55e",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e2e8f0',
          font: { size: 14 }
        }
      },
      title: {
        display: true,
        text: 'Monthly Spending Trend',
        color: '#e2e8f0',
        font: { size: 16, weight: 'bold' }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `₹${context.raw.toLocaleString('en-IN')}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: '#cbd5e1' }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: {
          color: '#cbd5e1',
          callback: function(value) {
            return '₹' + value.toLocaleString('en-IN');
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg h-80">
      {hasData ? (
        <Line data={chartData} options={options} />
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-gray-400">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-lg">No trend data available</p>
          <p className="text-sm">Add transactions to see your spending trends</p>
        </div>
      )}
    </div>
  );
};

export default TrendLineChart;
