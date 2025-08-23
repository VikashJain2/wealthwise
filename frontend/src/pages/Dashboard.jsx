import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import CategoryPieChart from "../components/CategoryPieChart";
import TrendLineChart from "../components/TrendLineChart";
import IncomeExpenseBarChart from "../components/IncomeExpenseBarChart";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, logout } = useContext(AuthContext);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/analytics`, {
        withCredentials: true,
      });
      setAnalytics(res.data);
    } catch (err) {
      // Handle 404 or empty data gracefully
      if (err.response?.status === 404) {
        setAnalytics({
          summary: { income: 0, expenses: 0, balance: 0 },
          byCategory: [],
          monthlyTrends: [],
        });
      } else {
        setError(err.response?.data?.msg || "Error fetching analytics");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Logout Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400">Welcome back, {user?.email}</p>
          </div>
          <div className="mt-4 md:mt-0 relative">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4 H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
                  <h3 className="text-xl font-semibold mb-4">Confirm Logout</h3>
                  <p className="text-gray-400 mb-6">
                    Are you sure you want to logout?
                  </p>
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setShowLogoutConfirm(false)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Yes, Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-green-500/10 p-3 mr-4">
                <svg
                  className="w-6 h-6 text-green-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 3h8v2h-6.42c.9.73 1.42 1.84 1.42 3 0 2.21-1.79 4-4 4H8v2h2l5.5 8H12l-4-6H6v-2h4c1.1 0 2-.9 2-2s-.9-2-2-2H6V7h6c.55 0 1-.45 1-1s-.45-1-1-1H6V3h6z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Total Income
                </p>
                <p className="text-2xl font-semibold text-green-400">
                  {formatCurrency(analytics?.summary?.income || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-red-500/10 p-3 mr-4">
                <svg
                  className="w-6 h-6 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Total Expenses
                </p>
                <p className="text-2xl font-semibold text-red-400">
                  {formatCurrency(analytics?.summary?.expenses || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-500/10 p-3 mr-4">
                <svg
                  className="w-6 h-6 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Balance</p>
                <p
                  className={`text-2xl font-semibold ${
                    (analytics?.summary?.balance || 0) >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {formatCurrency(analytics?.summary?.balance || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Income vs Expenses
            </h3>
            <IncomeExpenseBarChart
              data={analytics?.summary || { income: 0, expenses: 0 }}
            />
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Spending by Category
            </h3>
            <CategoryPieChart
              data={
                analytics?.byCategory?.filter(
                  (item) => item.type === "expense"
                ) || []
              }
            />
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-4">
              Monthly Trends
            </h3>
            <TrendLineChart data={analytics?.monthlyTrends || []} />
          </div>
        </div>

        {/* Empty state encouragement */}
        {analytics?.summary?.income === 0 &&
          analytics?.summary?.expenses === 0 && (
            <div className="bg-gray-800 rounded-xl shadow-lg p-8 text-center mb-8">
              <div className="max-w-md mx-auto">
                <svg
                  className="w-16 h-16 mx-auto text-gray-500 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1极速飞艇 c-1.11 0-2.08-.极速飞艇 402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Welcome to WealthWise!
                </h3>
                <p className="text-gray-400 mb-4">
                  Get started by adding your first transaction to track your
                  finances.
                </p>
              </div>
            </div>
          )}

        {/* Transactions Section */}
        <div className="mb-8">
          <TransactionForm onTransactionAdded={fetchAnalytics} />
        </div>

        <div>
          <TransactionList fetchAnalytics={fetchAnalytics}/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
