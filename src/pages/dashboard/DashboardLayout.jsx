import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router';
import { AuthContext } from '../../context/AuthContext';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'My Profile', icon: '👤' },
    { path: '/dashboard/add-product', label: 'Add Product', icon: '➕' },
    { path: '/dashboard/my-products', label: 'My Products', icon: '📦' },
  ];

  const isActive = (path) => location.pathname === path;

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
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-xl shadow-2xl shadow-purple-500/10 border-r border-purple-100 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-purple-50">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                StackSphere
              </h1>
              <p className="text-xs text-gray-500">Dashboard</p>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-2xl font-medium transition-all duration-300 group relative overflow-hidden
                ${isActive(item.path) 
                  ? 'bg-gradient-to-r from-purple-500/10 to-violet-500/10 text-purple-600 border border-purple-200' 
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }
              `}
            >
              {/* Active Indicator */}
              {isActive(item.path) && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-500 to-violet-500 rounded-r-full"></div>
              )}
              
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
              
              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </Link>
          ))}
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
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Page Title */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {menuItems.find(item => isActive(item.path))?.label || 'Dashboard'}
              </h1>
              <p className="text-sm text-gray-600">Manage your account and products</p>
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="font-semibold text-gray-900">Welcome back!</p>
                <p className="text-sm text-gray-600">User Dashboard</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">U</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-purple-500/10 border border-white/20 overflow-hidden">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;