import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const API_BASE = "http://localhost:3000";

const StatisticsPage = () => {
  const [stats, setStats] = useState({
    products: {
      accepted: 0,
      pending: 0,
      rejected: 0,
      total: 0
    },
    users: {
      total: 0,
      premium: 0,
      regular: 0
    },
    reviews: {
      total: 0
    },
    revenue: {
      total: 0,
      monthly: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all'); // 'all', 'month', 'week'

  useEffect(() => {
    fetchStatistics();
  }, [timeRange]);

  const fetchStatistics = async () => {
    try {
      // You'll need to create these endpoints in your backend
      const response = await fetch(`${API_BASE}/admin/statistics?range=${timeRange}`);
      
      if (!response.ok) {
        // Fallback to dummy data for development
        console.log("Using dummy data for development");
        setStats(generateDummyStats());
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      console.log("Received statistics:", data);
      setStats(data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      // Fallback to dummy data
      setStats(generateDummyStats());
    } finally {
      setLoading(false);
    }
  };

  // Generate dummy statistics for development
  const generateDummyStats = () => {
    return {
      products: {
        accepted: 342,
        pending: 23,
        rejected: 45,
        total: 410
      },
      users: {
        total: 1250,
        premium: 289,
        regular: 961
      },
      reviews: {
        total: 1567
      },
      revenue: {
        total: 12500,
        monthly: 2450
      }
    };
  };

  // Pie Chart Data for Products
  const productsChartData = {
    labels: ['Accepted', 'Pending', 'Rejected'],
    datasets: [
      {
        data: [stats.products.accepted, stats.products.pending, stats.products.rejected],
        backgroundColor: [
          '#10b981', // Green for accepted
          '#f59e0b', // Yellow for pending
          '#ef4444'  // Red for rejected
        ],
        borderColor: [
          '#10b981',
          '#f59e0b',
          '#ef4444'
        ],
        borderWidth: 2,
        hoverOffset: 8
      },
    ],
  };

  // Pie Chart Data for Users
  const usersChartData = {
    labels: ['Premium Users', 'Regular Users'],
    datasets: [
      {
        data: [stats.users.premium, stats.users.regular],
        backgroundColor: [
          '#f59e0b', // Yellow for premium
          '#3b82f6'  // Blue for regular
        ],
        borderColor: [
          '#f59e0b',
          '#3b82f6'
        ],
        borderWidth: 2,
        hoverOffset: 8
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#374151',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '0%', // Regular pie chart (not doughnut)
  };

  const StatCard = ({ title, value, change, icon, color, description }) => (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          <span className="text-xl text-white">{icon}</span>
        </div>
      </div>
      {change && (
        <div className="flex items-center text-sm">
          <span className={`font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change > 0 ? '↗' : '↘'} {Math.abs(change)}%
          </span>
          <span className="text-gray-500 ml-2">from last month</span>
        </div>
      )}
      {description && (
        <p className="text-xs text-gray-500 mt-2">{description}</p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Platform Statistics</h2>
          <p className="text-gray-600">Analytics and insights dashboard</p>
        </div>

        {/* Time Range Filter */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl p-1 border border-gray-200 shadow-sm">
            {['all', 'month', 'week'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 capitalize ${
                  timeRange === range
                    ? 'bg-red-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                {range === 'all' ? 'All Time' : range}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.users.total.toLocaleString()}
            change={12.5}
            icon="👥"
            color="bg-purple-500"
            description="Registered platform users"
          />
          <StatCard
            title="Total Products"
            value={stats.products.total.toLocaleString()}
            change={8.2}
            icon="📦"
            color="bg-blue-500"
            description="Submitted products"
          />
          <StatCard
            title="Total Reviews"
            value={stats.reviews.total.toLocaleString()}
            change={15.3}
            icon="⭐"
            color="bg-yellow-500"
            description="User reviews posted"
          />
          <StatCard
            title="Total Revenue"
            value={`$${stats.revenue.total.toLocaleString()}`}
            change={22.7}
            icon="💰"
            color="bg-green-500"
            description="Platform revenue"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Products Pie Chart */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Product Status Distribution</h3>
                <p className="text-sm text-gray-600">Breakdown of product submission status</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total: {stats.products.total}</p>
              </div>
            </div>
            <div className="h-80">
              <Pie data={productsChartData} options={chartOptions} />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4 text-center">
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <div className="text-lg font-bold text-green-600">{stats.products.accepted}</div>
                <div className="text-sm text-green-700">Accepted</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                <div className="text-lg font-bold text-yellow-600">{stats.products.pending}</div>
                <div className="text-sm text-yellow-700">Pending</div>
              </div>
              <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                <div className="text-lg font-bold text-red-600">{stats.products.rejected}</div>
                <div className="text-sm text-red-700">Rejected</div>
              </div>
            </div>
          </div>

          {/* Users Pie Chart */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">User Membership Distribution</h3>
                <p className="text-sm text-gray-600">Breakdown of user membership types</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total: {stats.users.total}</p>
              </div>
            </div>
            <div className="h-80">
              <Pie data={usersChartData} options={chartOptions} />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 text-center">
              <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                <div className="text-lg font-bold text-yellow-600">{stats.users.premium}</div>
                <div className="text-sm text-yellow-700">Premium Users</div>
                <div className="text-xs text-yellow-600 mt-1">
                  {Math.round((stats.users.premium / stats.users.total) * 100)}%
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="text-lg font-bold text-blue-600">{stats.users.regular}</div>
                <div className="text-sm text-blue-700">Regular Users</div>
                <div className="text-xs text-blue-600 mt-1">
                  {Math.round((stats.users.regular / stats.users.total) * 100)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Platform Health */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200">
            <h4 className="text-lg font-semibold text-green-800 mb-4">Platform Health</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-green-700">Acceptance Rate</span>
                <span className="font-bold text-green-800">
                  {Math.round((stats.products.accepted / stats.products.total) * 100)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-700">Premium Conversion</span>
                <span className="font-bold text-green-800">
                  {Math.round((stats.users.premium / stats.users.total) * 100)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-700">Avg. Reviews per Product</span>
                <span className="font-bold text-green-800">
                  {(stats.reviews.total / stats.products.total).toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl p-6 border border-blue-200">
            <h4 className="text-lg font-semibold text-blue-800 mb-4">Recent Activity</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">📦</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">23 new products submitted</p>
                  <p className="text-xs text-blue-700">Today</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">⭐</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">45 new reviews posted</p>
                  <p className="text-xs text-blue-700">Last 24 hours</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">👥</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">12 new users registered</p>
                  <p className="text-xs text-blue-700">This week</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-6 border border-purple-200">
            <h4 className="text-lg font-semibold text-purple-800 mb-4">Quick Actions</h4>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-white rounded-xl border border-purple-200 hover:bg-purple-50 transition-all duration-300 group">
                <div className="flex items-center space-x-3">
                  <span className="text-purple-600 group-hover:scale-110 transition-transform">📊</span>
                  <div>
                    <div className="font-medium text-purple-900">View Detailed Reports</div>
                    <div className="text-xs text-purple-600">Export analytics data</div>
                  </div>
                </div>
              </button>
              <button className="w-full text-left p-3 bg-white rounded-xl border border-purple-200 hover:bg-purple-50 transition-all duration-300 group">
                <div className="flex items-center space-x-3">
                  <span className="text-purple-600 group-hover:scale-110 transition-transform">👥</span>
                  <div>
                    <div className="font-medium text-purple-900">Manage Users</div>
                    <div className="text-xs text-purple-600">User role management</div>
                  </div>
                </div>
              </button>
              <button className="w-full text-left p-3 bg-white rounded-xl border border-purple-200 hover:bg-purple-50 transition-all duration-300 group">
                <div className="flex items-center space-x-3">
                  <span className="text-purple-600 group-hover:scale-110 transition-transform">🎫</span>
                  <div>
                    <div className="font-medium text-purple-900">Manage Coupons</div>
                    <div className="text-xs text-purple-600">Discount management</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Platform Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="text-center p-3 bg-white rounded-xl border border-gray-200">
              <div className="text-lg font-bold text-purple-600">{stats.users.total}</div>
              <div className="text-gray-600">Total Community Members</div>
            </div>
            <div className="text-center p-3 bg-white rounded-xl border border-gray-200">
              <div className="text-lg font-bold text-blue-600">{stats.products.total}</div>
              <div className="text-gray-600">Products Shared</div>
            </div>
            <div className="text-center p-3 bg-white rounded-xl border border-gray-200">
              <div className="text-lg font-bold text-green-600">${stats.revenue.total}</div>
              <div className="text-gray-600">Total Revenue Generated</div>
            </div>
            <div className="text-center p-3 bg-white rounded-xl border border-gray-200">
              <div className="text-lg font-bold text-yellow-600">{stats.reviews.total}</div>
              <div className="text-gray-600">Community Reviews</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;