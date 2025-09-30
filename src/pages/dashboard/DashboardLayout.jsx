import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router";
import { AuthContext } from "../../context/AuthContext";

const API_BASE = "https://stack-back-omega.vercel.app";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [userProductCount, setUserProductCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?.email) {
      fetchUserData();
    }
  }, [user?.email]);

  const fetchUserData = async () => {
    try {
      // Fetch user profile
      const profileResponse = await fetch(
        `${API_BASE}/user-profile/${user.email}`
      );
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setUserProfile(profileData);
      }

      // Fetch user's product count
      const productsResponse = await fetch(
        `${API_BASE}/products/user/${user.email}`
      );
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setUserProductCount(productsData.length);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      path: "/dashboard",
      label: "My Profile",
      icon: "👤",
      description: "Manage your account",
    },
    {
      path: "/dashboard/add-product",
      label: "Add Product",
      icon: "➕",
      description: "Submit new product",
      badge: userProductCount,
      showBadge: true,
    },
    {
      path: "/dashboard/my-products",
      label: "My Products",
      icon: "📦",
      description: "View your submissions",
      badge: userProductCount,
      showBadge: true,
    },
  ];

  const isActive = (path) => location.pathname === path;

  const isPremium = userProfile?.membership?.status === "premium";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30">
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
        fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-xl shadow-2xl shadow-purple-500/10 border-r border-purple-100 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
      `}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-purple-50">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                StackVault
              </h1>
              <p className="text-xs text-gray-500">Dashboard</p>
            </div>
          </Link>
        </div>

        {/* User Info Section */}
        <div className="p-4 border-b border-purple-50">
          <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl border border-purple-100">
            <div className="relative">
              <img
                src={
                  user?.photoURL ||
                  "https://www.w3schools.com/w3images/avatar2.png"
                }
                alt="User Avatar"
                className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
              />
              {isPremium && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-xs text-white">⭐</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">
                {user?.displayName || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {isPremium ? "⭐ Premium" : "Free Account"}
              </p>
              <div className="flex items-center space-x-1 mt-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isPremium ? "bg-green-400" : "bg-blue-400"
                  }`}
                ></div>
                <p className="text-xs text-gray-500">
                  {userProductCount} product{userProductCount !== 1 ? "s" : ""}
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
                    ? "bg-gradient-to-r from-purple-500/10 to-violet-500/10 text-purple-600 border border-purple-200"
                    : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                }
              `}
            >
              {/* Active Indicator */}
              {isActive(item.path) && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-500 to-violet-500 rounded-r-full"></div>
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

              {/* Badge for product count */}
              {item.showBadge && item.badge !== undefined && (
                <span
                  className={`
                  inline-flex items-center justify-center min-w-6 h-6 text-xs font-semibold rounded-full border transition-all duration-300
                  ${
                    isActive(item.path)
                      ? "bg-purple-500 text-white border-purple-500"
                      : "bg-gray-100 text-gray-600 border-gray-200 group-hover:bg-purple-100 group-hover:text-purple-600 group-hover:border-purple-200"
                  }
                `}
                >
                  {item.badge}
                </span>
              )}

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </Link>
          ))}

          {/* Membership Status Card */}
          {!isPremium && (
            <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl border border-orange-200">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🚀</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-orange-800">
                    Upgrade to Premium
                  </p>
                  <p className="text-xs text-orange-600">
                    Unlock unlimited products
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-orange-700">
                  Products: {userProductCount}/1
                </span>
                <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs">
                  Limited
                </span>
              </div>
            </div>
          )}

          {isPremium && (
            <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">⭐</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-800">
                    Premium Member
                  </p>
                  <p className="text-xs text-green-600">Unlimited products</p>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-purple-50">
          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-3 rounded-2xl text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300 group"
          >
            <span className="text-xl">🏠</span>
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-purple-100 sticky top-0 z-30">
          <div className="flex items-center justify-between p-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300"
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
                  "Dashboard"}
              </h1>
              <p className="text-sm text-gray-600">
                {menuItems.find((item) => isActive(item.path))?.description ||
                  "Manage your account and products"}
              </p>
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="font-semibold text-gray-900">
                  {isPremium ? "⭐ Premium Member" : "Welcome back!"}
                </p>
                <p className="text-sm text-gray-600">
                  {userProductCount} product{userProductCount !== 1 ? "s" : ""}{" "}
                  submitted
                </p>
              </div>
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center shadow-lg">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <span className="text-white font-bold text-sm">
                      {user?.displayName?.charAt(0) || "U"}
                    </span>
                  )}
                </div>
                {isPremium && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-xs text-white">⭐</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-purple-500/10 border border-white/20 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
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

export default DashboardLayout;
