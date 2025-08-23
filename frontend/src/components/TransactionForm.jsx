import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

const TransactionForm = ({ onTransactionAdded }) => {
  const [formData, setFormData] = useState({ 
    amount: '', 
    category: '', 
    type: 'expense', 
    date: new Date().toISOString().slice(0, 10),
    description: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const isReadOnly = user.role === 'read-only';

  const categories = [
    'Food & Dining', 'Transportation', 'Entertainment', 'Utilities', 
    'Rent/Mortgage', 'Salary', 'Freelance', 'Investments', 'Shopping', 'Healthcare', 'Other'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isReadOnly) return;
    
    setLoading(true);
    setError('');

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/transactions`, formData, {withCredentials: true});
      setFormData({ 
        amount: '', 
        category: '', 
        type: 'expense', 
        date: new Date().toISOString().slice(0, 10),
        description: '' 
      });
      if (onTransactionAdded) onTransactionAdded();
    } catch (err) {
      setError(err.response?.data?.msg || 'Error adding transaction');
    }
    
    setLoading(false);
  };

  if (isReadOnly) return null;

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg mb-6">
      <h2 className="text-xl font-semibold text-white mb-4">Add New Transaction</h2>
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Amount</label>
        
<input
  type="number"
  step="1" 
  name="amount"
  value={formData.amount}
  onChange={handleChange}
  required
  className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
  placeholder="0" 
/>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
            <div className="flex rounded-lg overflow-hidden">
              <button
                type="button"
                className={`flex-1 py-2.5 px-4 text-sm font-medium transition-colors ${
                  formData.type === 'income' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                onClick={() => setFormData({...formData, type: 'income'})}
              >
                Income
              </button>
              <button
                type="button"
                className={`flex-1 py-2.5 px-4 text-sm font-medium transition-colors ${
                  formData.type === 'expense' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                onClick={() => setFormData({...formData, type: 'expense'})}
              >
                Expense
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Description (Optional)</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            placeholder="Transaction description"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 transition-colors flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding Transaction...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Transaction
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;