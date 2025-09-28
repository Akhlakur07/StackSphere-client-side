import React, { useState, useContext } from 'react';
import { Link } from 'react-router';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-violet-600 shadow-md w-full">
      <div className="max-w-screen-xl mx-auto px-6 sm:px-8 lg:px-10 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Website Name */}
          <Link to="/" className="text-3xl font-bold text-white tracking-wide hover:text-violet-300 transition">
            StackSphere
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="text-white text-lg font-medium hover:text-violet-200 transition"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-white text-lg font-medium hover:text-violet-200 transition"
            >
              Products
            </Link>

            {/* Conditionally render Login/Register or Logout */}
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2 rounded-xl bg-white text-purple-600 hover:bg-violet-100 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 rounded-xl bg-purple-600 text-white hover:bg-violet-700 transition"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                {/* User Profile Picture */}
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 rounded-full p-2 bg-white hover:bg-violet-200 transition"
                  >
                    <img
                      src={user?.photoURL || 'https://www.w3schools.com/w3images/avatar2.png'}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                    />
                  </button>

                  {/* Dropdown */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-white shadow-xl rounded-lg p-2">
                      <div className="text-center">
                        <p className="text-sm font-semibold text-gray-700">{user?.displayName}</p>
                        <div className="mt-2">
                          <Link
                            to="/dashboard"
                            className="block text-gray-700 hover:text-violet-600 py-1 px-2 rounded-md"
                          >
                            Dashboard
                          </Link>
                        </div>
                        <button
                          onClick={logOut}
                          className="mt-2 w-full text-red-600 hover:bg-gray-100 py-1 px-2 rounded-md text-center"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;