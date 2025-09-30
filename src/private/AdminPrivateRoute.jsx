import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "../context/AuthContext";

const API_BASE = "http://localhost:3000";

const AdminPrivateRoute = ({ children }) => {
  const { user, loading } = React.useContext(AuthContext);
  const [userRole, setUserRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user?.email) {
        try {
          const response = await fetch(`${API_BASE}/user-profile/${user.email}`);
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

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-red-50/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking admin permissions...</p>
        </div>
      </div>
    );
  }

  if (user && user?.email && userRole === "admin") {
    return children;
  }

  if (user && user?.email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-red-50/30">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Access Required</h2>
          <p className="text-gray-600 mb-6">You need administrator privileges to access this page.</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <Navigate state={location.pathname} to="/login" />;
};

export default AdminPrivateRoute;