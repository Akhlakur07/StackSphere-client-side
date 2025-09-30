import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { AuthContext } from "../context/AuthContext";

const API_BASE = "http://localhost:3000";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [roleLoading, setRoleLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user?.email) {
        try {
          const response = await fetch(
            `${API_BASE}/user-profile/${user.email}`
          );
          if (response.ok) {
            const userData = await response.json();
            setUserRole(userData.role);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        } finally {
          setRoleLoading(false);
        }
      } else {
        setRoleLoading(false);
      }
    };

    fetchUserRole();
  }, [user?.email]);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const toggleMobileMenu = () => setMobileMenuOpen((prevState) => !prevState);

  const isActiveLink = (path) => location.pathname === path;

  const getDashboardUrl = () => {
    if (userRole === "admin") {
      return "/admin";
    }
    if (userRole === "moderator") {
      return "/moderator";
    }
    return "/dashboard";
  };

  const getDashboardLabel = () => {
    if (userRole === "admin") return "Admin Dashboard";
    if (userRole === "moderator") return "Moderator Dashboard";
    return "Dashboard";
  };

  const getDashboardIcon = () => {
    if (userRole === "admin") return "⚡";
    if (userRole === "moderator") return "🛠️";
    return "📊";
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/products", label: "Products" },
    { path: "/community", label: "Community" },
    { path: "/about", label: "About" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-2xl shadow-purple-500/10 py-3"
          : "bg-gradient-to-r from-purple-600 to-violet-600 py-5"
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo/Website Name with Animation */}
          <Link
            to="/"
            className={`text-2xl lg:text-3xl font-black tracking-tight transition-all duration-300 hover:scale-105 ${
              isScrolled ? "text-purple-600" : "text-white"
            }`}
          >
            <div className="flex items-center space-x-2">
              <div className="relative">
                <span className="relative z-10">StackSphere</span>
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-purple-400 to-violet-400 blur-sm opacity-50 -z-10 ${
                    isScrolled ? "hidden" : "block"
                  }`}
                ></div>
              </div>
              <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full animate-pulse"></div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-lg font-semibold transition-all duration-300 group ${
                  isScrolled
                    ? isActiveLink(link.path)
                      ? "text-purple-600"
                      : "text-gray-700 hover:text-purple-600"
                    : isActiveLink(link.path)
                    ? "text-white"
                    : "text-white/90 hover:text-white"
                }`}
              >
                {link.label}
                {/* Animated underline */}
                <span
                  className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-violet-400 transition-all duration-300 group-hover:w-full ${
                    isActiveLink(link.path) ? "w-full" : ""
                  }`}
                ></span>

                {/* Hover glow effect */}
                <span
                  className={`absolute -inset-2 rounded-lg bg-gradient-to-r from-purple-400/10 to-violet-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10 ${
                    isActiveLink(link.path) ? "opacity-100" : ""
                  }`}
                ></span>
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                    isScrolled
                      ? "bg-gradient-to-r from-purple-500 to-violet-500 text-white hover:from-purple-600 hover:to-violet-600 shadow-md shadow-purple-500/25"
                      : "bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 hover:border-white/50"
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-violet-500 text-white transform hover:scale-105 hover:shadow-lg shadow-md shadow-purple-500/25 transition-all duration-300 hover:from-purple-600 hover:to-violet-600"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                {/* Role Badge */}
                {userRole && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      isScrolled
                        ? userRole === "moderator"
                          ? "bg-orange-100 text-orange-800 border-orange-200"
                          : userRole === "admin"
                          ? "bg-red-100 text-red-800 border-red-200"
                          : "bg-purple-100 text-purple-800 border-purple-200"
                        : userRole === "moderator"
                        ? "bg-orange-500/20 text-orange-200 border-orange-400/30"
                        : userRole === "admin"
                        ? "bg-red-500/20 text-red-200 border-red-400/30"
                        : "bg-white/20 text-white border-white/30"
                    }`}
                  >
                    {userRole === "moderator" && "🛠️ Moderator"}
                    {userRole === "admin" && "⚡ Admin"}
                    {userRole === "user" && "👤 User"}
                  </span>
                )}

                {/* User Profile Picture with Enhanced Dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-3 group"
                  >
                    <div className="relative">
                      <img
                        src={
                          user?.photoURL ||
                          "https://www.w3schools.com/w3images/avatar2.png"
                        }
                        alt="User Avatar"
                        className="w-11 h-11 rounded-full border-2 border-white/80 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:border-purple-300 group-hover:shadow-purple-500/25"
                      />
                      {/* Role indicator */}
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                          userRole === "moderator"
                            ? "bg-orange-400"
                            : userRole === "admin"
                            ? "bg-red-400"
                            : "bg-green-400"
                        }`}
                      >
                        <span className="text-xs text-white">
                          {userRole === "moderator"
                            ? "🛠️"
                            : userRole === "admin"
                            ? "⚡"
                            : "👤"}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`text-left transition-colors duration-300 ${
                        isScrolled ? "text-gray-700" : "text-white"
                      }`}
                    >
                      <p className="font-semibold text-sm">
                        {user?.displayName || "User"}
                      </p>
                      <p className="text-xs opacity-70">
                        {getDashboardLabel()}
                      </p>
                    </div>
                    <svg
                      className={`w-4 h-4 transition-transform duration-300 ${
                        dropdownOpen ? "rotate-180" : ""
                      } ${isScrolled ? "text-gray-600" : "text-white"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Enhanced Dropdown */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-4 w-64 bg-white/95 backdrop-blur-xl shadow-2xl shadow-purple-500/20 rounded-2xl border border-white/20 overflow-hidden animate-fade-in">
                      {/* User Info Header */}
                      <div className="p-4 bg-gradient-to-r from-purple-500/10 to-violet-500/10 border-b border-white/10">
                        <div className="flex items-center space-x-3">
                          <img
                            src={
                              user?.photoURL ||
                              "https://www.w3schools.com/w3images/avatar2.png"
                            }
                            alt="User Avatar"
                            className="w-12 h-12 rounded-full border-2 border-white/80"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-800 truncate">
                              {user?.displayName || "User"}
                            </p>
                            <p className="text-sm text-gray-600 truncate">
                              {user?.email}
                            </p>
                            <div className="flex items-center space-x-1 mt-1">
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  userRole === "moderator"
                                    ? "bg-orange-100 text-orange-800"
                                    : userRole === "admin"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-purple-100 text-purple-800"
                                }`}
                              >
                                {userRole === "moderator" && "🛠️ Moderator"}
                                {userRole === "admin" && "⚡ Admin"}
                                {userRole === "user" && "👤 User"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-2">
                        <Link
                          to={getDashboardUrl()}
                          className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 group"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <span className="text-lg">{getDashboardIcon()}</span>
                          <div>
                            <span className="font-medium">
                              {getDashboardLabel()}
                            </span>
                            <p className="text-xs text-gray-500">
                              {userRole === "moderator" &&
                                "Manage product reviews"}
                              {userRole === "admin" && "Administrator panel"}
                              {userRole === "user" && "Your products & profile"}
                            </p>
                          </div>
                        </Link>

                        <Link
                          to="/profile"
                          className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 group"
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
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span className="font-medium">Profile Settings</span>
                        </Link>

                        <div className="border-t border-gray-100 my-2"></div>

                        <button
                          onClick={logOut}
                          className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 group w-full"
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
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          <span className="font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className={`lg:hidden p-2 rounded-xl transition-all duration-300 ${
              isScrolled
                ? "text-gray-700 hover:bg-gray-100"
                : "text-white hover:bg-white/20"
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-white/20 pt-4 animate-slide-down">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    isScrolled
                      ? isActiveLink(link.path)
                        ? "bg-purple-100 text-purple-600"
                        : "text-gray-700 hover:bg-gray-100"
                      : isActiveLink(link.path)
                      ? "bg-white/20 text-white"
                      : "text-white/90 hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {!user ? (
                <div className="flex flex-col space-y-3 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 text-center rounded-xl font-semibold bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 transition-all duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 text-center rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-violet-500 text-white hover:from-purple-600 hover:to-violet-600 transition-all duration-300"
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <div className="pt-2 border-t border-white/20">
                  {/* Role Badge in Mobile */}
                  {userRole && (
                    <div className="px-4 py-2 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          userRole === "moderator"
                            ? "bg-orange-500/20 text-orange-200 border border-orange-400/30"
                            : userRole === "admin"
                            ? "bg-red-500/20 text-red-200 border border-red-400/30"
                            : "bg-white/20 text-white border border-white/30"
                        }`}
                      >
                        {userRole === "moderator" && "🛠️ Moderator"}
                        {userRole === "admin" && "⚡ Admin"}
                        {userRole === "user" && "👤 User"}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center space-x-3 px-4 py-3">
                    <img
                      src={
                        user?.photoURL ||
                        "https://www.w3schools.com/w3images/avatar2.png"
                      }
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full border-2 border-white/80"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-white">
                        {user?.displayName || "User"}
                      </p>
                      <p className="text-sm text-white/70">
                        {getDashboardLabel()}
                      </p>
                    </div>
                  </div>

                  <Link
                    to={getDashboardUrl()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                  >
                    <span className="text-lg">{getDashboardIcon()}</span>
                    <span>Go to {getDashboardLabel()}</span>
                  </Link>

                  <button
                    onClick={logOut}
                    className="w-full px-4 py-3 text-left text-red-300 hover:bg-white/10 rounded-xl transition-all duration-300"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
