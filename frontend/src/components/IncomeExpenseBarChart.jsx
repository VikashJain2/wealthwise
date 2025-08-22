import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const IncomeExpenseBarChart = ({ data }) => {
  const hasData = data && (data.income > 0 || data.expenses > 0);
  
  const chartData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        label: 'Amount',
        data: hasData ? [data.income, data.expenses] : [0, 0],
        backgroundColor: [
          'rgba(74, 222, 128, 0.7)',
          'rgba(248, 113, 113, 0.7)',
        ],
        borderColor: [
          'rgba(74, 222, 128, 1)',
          'rgba(248, 113, 113, 1)',
        ],
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

 // IncomeExpenseBarChart.jsx - Update the tooltip callback
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#e2e8f0',
        font: {
          size: 14
        }
      }
    },
    title: {
      display: true,
      text: 'Income vs Expenses',
      color: '#e2e8f0',
      font: {
        size: 16,
        weight: 'bold'
      }
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
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: '#cbd5e1'
      }
    },
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: '#cbd5e1',
        callback: function(value) {
          return '₹' + value.toLocaleString('en-IN');
        }
      }
    },
  },
  maintainAspectRatio: false
};

  return (
    <div className="h-80">
      {hasData ? (
        <Bar data={chartData} options={options} />
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-gray-400">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2极速飞艇 v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-lg">No financial data yet</p>
          <p className="text-sm">Add income and expenses to get started</p>
        </div>
      )}
    </div>
  );
};

export default IncomeExpenseBarChart;