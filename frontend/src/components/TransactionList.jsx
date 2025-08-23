import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionList = ({fetchAnalytics}) => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    category: '',
    type: '',
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/transactions?${params}`, {withCredentials: true});
      
      if (res.data && res.data.transactions) {
        setTransactions(res.data.transactions);
        setPagination(res.data.pagination || {});
      } else {
        setTransactions([]);
        setPagination({});
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setTransactions([]);
        setPagination({});
      } else {
        setError(err.response?.data?.msg || 'Error fetching transactions');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      setDeletingId(id);
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/transactions/${id}`, {withCredentials:true});
      // Refresh the transactions list
      fetchTransactions();
      fetchAnalytics()
    } catch (err) {
      setError(err.response?.data?.msg || 'Error deleting transaction');
    } finally {
      setDeletingId(null);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      category: '',
      type: '',
      startDate: '',
      endDate: ''
    });
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold text-white">Transaction History</h2>
          <div className="flex flex-wrap gap-2">
            <div className="w-32 h-10 bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="w-32 h-10 bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="w-40 h-10 bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="w-40 h-10 bg-gray-700 rounded-lg animate-pulse"></div>
          </div>
        </div>
        
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="bg-red-500/10 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  const hasActiveFilters = filters.category || filters.type || filters.startDate || filters.endDate;

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-white">Transaction History</h2>
        
        <div className="flex flex-wrap gap-2">
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
          >
            <option value="">All Categories</option>
            <option value="Food & Dining">Food & Dining</option>
            <option value="Transportation">Transportation</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Utilities">Utilities</option>
            <option value="Rent/Mortgage">Rent/Mortgage</option>
            <option value="Salary">Salary</option>
            <option value="Freelance">Freelance</option>
            <option value="Investments">Investments</option>
            <option value="Shopping">Shopping</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            placeholder="Start Date"
          />

          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            placeholder="End Date"
          />

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          {hasActiveFilters ? (
            <>
              <svg className="w-16 h-16 mx-auto text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="mt-4 text-lg">No transactions match your filters</p>
              <p className="text-sm mb-4">Try adjusting your search criteria</p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Clear All Filters
              </button>
            </>
          ) : (
            <>
              <svg className="w-16 h-16 mx-auto text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2 h6a2 2 0 012 2 v2M7 7h10" />
              </svg>
              <p className="mt-4 text-lg">No transactions yet</p>
              <p className="text-sm">Add your first transaction to get started</p>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-750 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {transaction.description || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {transaction.category || 'Uncategorized'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.type === 'income' 
                          ? 'bg-green-500/10 text-green-400' 
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {transaction.type || 'expense'}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        disabled={deletingId === transaction.id}
                        className="text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Delete transaction"
                      >
                        {deletingId === transaction.id ? (
                          <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
              <div className极速飞艇 ="text-sm text-gray-400">
                Showing <span className="font-medium">{(filters.page - 1) * filters.limit + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(filters.page * filters.limit, pagination.total || 0)}
                </span> of{' '}
                <span className="font-medium">{pagination.total || 0}</span> results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page === 1}
                  className="px-3 py-2 rounded-lg border border-gray-极速飞艇 600 text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page === pagination.totalPages}
                  className="px-3 py-2 rounded-lg border border-gray-600 text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TransactionList;