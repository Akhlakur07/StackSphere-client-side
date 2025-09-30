import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router";
import { AuthContext } from "../../context/AuthContext";

const API_BASE = "https://stack-back-omega.vercel.app";

const AdminDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [userProfile, setUserProfile] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalRevenue: 0,
    pendingReviews: 0,
  });
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?.email) {
      fetchAdminData();
    }
  }, [user?.email]);

  const fetchAdminData = async () => {
    try {
      // Fetch user profile
      const profileResponse = await fetch(
        `${API_BASE}/user-profile/${user.email}`
      );
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setUserProfile(profileData);
      }

      // Fetch admin stats (you'll implement these endpoints later)
      const statsResponse = await fetch(`${API_BASE}/admin/stats`);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      } else {
        // Fallback dummy stats for now
        setStats({
          totalUsers: 1250,
          totalProducts: 543,
          totalRevenue: 12500,
          pendingReviews: 23,
        });
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
      // Set fallback dummy stats
      setStats({
        totalUsers: 1250,
        totalProducts: 543,
        totalRevenue: 12500,
        pendingReviews: 23,
      });
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      path: "/admin/statistics",
      label: "Statistics",
      icon: "📊",
      description: "Platform analytics & insights",
      badge: null,
    },
    {
      path: "/admin/manage-users",
      label: "Manage Users",
      icon: "👥",
      description: "User management & roles",
      badge: stats.totalUsers,
      showBadge: true,
    },
    {
      path: "/admin/manage-coupons",
      label: "Manage Coupons",
      icon: "🎫",
      description: "Coupon & discount management",
      badge: null,
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50/30">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-xl shadow-2xl shadow-red-500/10 border-r border-red-100 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
      `}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-red-50">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                StackVault
              </h1>
              <p className="text-xs text-gray-500">Admin Dashboard</p>
            </div>
          </Link>
        </div>

        {/* Admin Info Section */}
        <div className="p-4 border-b border-red-50">
          <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-100">
            <div className="relative">
              <img
                src={
                  user?.photoURL ||
                  "https://www.w3schools.com/w3images/avatar2.png"
                }
                alt="Admin Avatar"
                className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-400 to-pink-400 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-xs text-white">⚡</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">
                {user?.displayName || "Administrator"}
              </p>
              <p className="text-xs text-gray-500 truncate">⚡ Super Admin</p>
              <div className="flex items-center space-x-1 mt-1">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <p className="text-xs text-gray-500">Full System Access</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center justify-between px-4 py-3 rounded-2xl font-medium transition-all duration-300 group relative overflow-hidden
                ${
                  isActive(item.path)
                    ? "bg-gradient-to-r from-red-500/10 to-pink-500/10 text-red-600 border border-red-200"
                    : "text-gray-600 hover:text-red-600 hover:bg-red-50"
                }
              `}
            >
              {/* Active Indicator */}
              {isActive(item.path) && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-red-500 to-pink-500 rounded-r-full"></div>
              )}

              <div className="flex items-center space-x-3">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <div className="text-sm font-semibold">{item.label}</div>
                  <div className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.description}
                  </div>
                </div>
              </div>

              {/* Badge for counts */}
              {item.showBadge && item.badge !== null && (
                <span
                  className={`
                  inline-flex items-center justify-center min-w-6 h-6 text-xs font-semibold rounded-full border transition-all duration-300
                  ${
                    isActive(item.path)
                      ? "bg-red-500 text-white border-red-500"
                      : "bg-gray-100 text-gray-600 border-gray-200 group-hover:bg-red-100 group-hover:text-red-600 group-hover:border-red-200"
                  }
                `}
                >
                  {item.badge}
                </span>
              )}

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </Link>
          ))}

          {/* Quick Stats */}
          <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-200">
            <h4 className="text-sm font-semibold text-purple-800 mb-2">
              Platform Overview
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-purple-700">Total Users</span>
                <span className="font-semibold bg-purple-500 text-white px-2 py-1 rounded-full">
                  {stats.totalUsers.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-700">Total Products</span>
                <span className="font-semibold bg-blue-500 text-white px-2 py-1 rounded-full">
                  {stats.totalProducts}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-700">Revenue</span>
                <span className="font-semibold bg-green-500 text-white px-2 py-1 rounded-full">
                  ${stats.totalRevenue.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-red-50">
          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-3 rounded-2xl text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-300 group"
          >
            <span className="text-xl">🏠</span>
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-red-100 sticky top-0 z-30">
          <div className="flex items-center justify-between p-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-300"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Page Title */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {menuItems.find((item) => isActive(item.path))?.label ||
                  "Admin Dashboard"}
              </h1>
              <p className="text-sm text-gray-600">
                {menuItems.find((item) => isActive(item.path))?.description ||
                  "Full system administration"}
              </p>
            </div>

            {/* Admin Info */}
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="font-semibold text-gray-900">
                  ⚡ Administrator Panel
                </p>
                <p className="text-sm text-gray-600">
                  System-wide access & control
                </p>
              </div>
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Admin Avatar"
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <span className="text-white font-bold text-sm">
                      {user?.displayName?.charAt(0) || "A"}
                    </span>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-400 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-xs text-white">⚡</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-red-500/10 border border-white/20 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
                </div>
              ) : (
                <Outlet />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
