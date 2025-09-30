/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router";
import { AuthContext } from "../../context/AuthContext";

const API_BASE = "http://localhost:3000";

const ModeratorDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [pendingProductsCount, setPendingProductsCount] = useState(0);
  const [reportedProductsCount, setReportedProductsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?.email) {
      fetchModeratorData();
    }
  }, [user?.email]);

  const fetchModeratorData = async () => {
    try {
      // Fetch user profile
      const profileResponse = await fetch(
        `${API_BASE}/user-profile/${user.email}`
      );
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setUserProfile(profileData);
      }

      // Fetch pending products count
      const pendingResponse = await fetch(`${API_BASE}/products/pending/count`);
      if (pendingResponse.ok) {
        const pendingData = await pendingResponse.json();
        setPendingProductsCount(pendingData.count);
      }

      // In your fetchModeratorData function, add:
      const reportedResponse = await fetch(
        `${API_BASE}/products/reported/count`
      );
      if (reportedResponse.ok) {
        const reportedData = await reportedResponse.json();
        setReportedProductsCount(reportedData.count);
      }
    } catch (error) {
      console.error("Error fetching moderator data:", error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      path: "/moderator/review-queue",
      label: "Product Review Queue",
      icon: "📋",
      description: "Review pending products",
      badge: pendingProductsCount,
      showBadge: true,
    },
    {
      path: "/moderator/reported-contents",
      label: "Reported Contents",
      icon: "🚩",
      description: "Manage reported products",
      badge: reportedProductsCount,
      showBadge: true,
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
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
        fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-xl shadow-2xl shadow-blue-500/10 border-r border-blue-100 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
      `}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-blue-50">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                StackVault
              </h1>
              <p className="text-xs text-gray-500">Moderator Dashboard</p>
            </div>
          </Link>
        </div>

        {/* Moderator Info Section */}
        <div className="p-4 border-b border-blue-50">
          <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
            <div className="relative">
              <img
                src={
                  user?.photoURL ||
                  "https://www.w3schools.com/w3images/avatar2.png"
                }
                alt="Moderator Avatar"
                className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-xs text-white">🛠️</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">
                {user?.displayName || "Moderator"}
              </p>
              <p className="text-xs text-gray-500 truncate">🛠️ Moderator</p>
              <div className="flex items-center space-x-1 mt-1">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <p className="text-xs text-gray-500">
                  {pendingProductsCount} pending
                </p>
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
                    ? "bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-600 border border-blue-200"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }
              `}
            >
              {/* Active Indicator */}
              {isActive(item.path) && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-r-full"></div>
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
              {item.showBadge && item.badge !== undefined && (
                <span
                  className={`
                  inline-flex items-center justify-center min-w-6 h-6 text-xs font-semibold rounded-full border transition-all duration-300
                  ${
                    isActive(item.path)
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-100 text-gray-600 border-gray-200 group-hover:bg-blue-100 group-hover:text-blue-600 group-hover:border-blue-200"
                  }
                `}
                >
                  {item.badge}
                </span>
              )}

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </Link>
          ))}

          {/* Quick Stats */}
          <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl border border-orange-200">
            <h4 className="text-sm font-semibold text-orange-800 mb-2">
              Quick Stats
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-orange-700">Pending Reviews</span>
                <span className="font-semibold bg-orange-500 text-white px-2 py-1 rounded-full">
                  {pendingProductsCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-orange-700">Reported Items</span>
                <span className="font-semibold bg-red-500 text-white px-2 py-1 rounded-full">
                  {reportedProductsCount}
                </span>
              </div>
            </div>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-50">
          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-3 rounded-2xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 group"
          >
            <span className="text-xl">🏠</span>
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-blue-100 sticky top-0 z-30">
          <div className="flex items-center justify-between p-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
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
                  "Moderator Dashboard"}
              </h1>
              <p className="text-sm text-gray-600">
                {menuItems.find((item) => isActive(item.path))?.description ||
                  "Manage platform content"}
              </p>
            </div>

            {/* Moderator Info */}
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="font-semibold text-gray-900">
                  🛠️ Moderator Panel
                </p>
                <p className="text-sm text-gray-600">
                  {pendingProductsCount} items pending review
                </p>
              </div>
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Moderator Avatar"
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <span className="text-white font-bold text-sm">
                      {user?.displayName?.charAt(0) || "M"}
                    </span>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-orange-400 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-xs text-white">🛠️</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-blue-500/10 border border-white/20 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
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

export default ModeratorDashboardLayout;
