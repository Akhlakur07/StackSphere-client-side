import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const API_BASE = "https://stack-back-omega.vercel.app";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingUser, setUpdatingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      console.log("Fetching all users...");

      // You'll need to create this endpoint in your backend
      const response = await fetch(`${API_BASE}/admin/users`);

      if (!response.ok) {
        // Fallback to dummy data if endpoint doesn't exist yet
        console.log("Using dummy data for development");
        setUsers(generateDummyUsers());
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log("Received users:", data);
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      // Fallback to dummy data
      setUsers(generateDummyUsers());
    } finally {
      setLoading(false);
    }
  };

  // Generate dummy users for development
  const generateDummyUsers = () => {
    return [
      {
        _id: "1",
        name: "John Doe",
        email: "john@example.com",
        photo: "https://www.w3schools.com/w3images/avatar2.png",
        role: "user",
        membership: { status: "none" },
        createdAt: new Date().toISOString(),
      },
      {
        _id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        photo: "https://www.w3schools.com/w3images/avatar2.png",
        role: "moderator",
        membership: { status: "premium" },
        createdAt: new Date().toISOString(),
      },
      {
        _id: "3",
        name: "Admin User",
        email: "admin@example.com",
        photo: "https://www.w3schools.com/w3images/avatar2.png",
        role: "admin",
        membership: { status: "premium" },
        createdAt: new Date().toISOString(),
      },
      {
        _id: "4",
        name: "Bob Wilson",
        email: "bob@example.com",
        photo: "https://www.w3schools.com/w3images/avatar2.png",
        role: "user",
        membership: { status: "none" },
        createdAt: new Date().toISOString(),
      },
      {
        _id: "5",
        name: "Alice Johnson",
        email: "alice@example.com",
        photo: "https://www.w3schools.com/w3images/avatar2.png",
        role: "user",
        membership: { status: "premium" },
        createdAt: new Date().toISOString(),
      },
    ];
  };

  const handleRoleUpdate = async (userId, newRole) => {
    setUpdatingUser(userId);

    try {
      // Show confirmation dialog
      const result = await Swal.fire({
        title: `Make User ${newRole === "admin" ? "Admin" : "Moderator"}?`,
        html: (
          <div className="text-left">
            <p className="text-gray-600 mb-4">
              You are about to change this user's role to{" "}
              <strong>{newRole}</strong>.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-sm text-yellow-700">
                <strong>⚠️ Important:</strong>{" "}
                {newRole === "admin"
                  ? "Admins have full system access and can manage all users and settings."
                  : "Moderators can review products and manage reported content."}
              </p>
            </div>
          </div>
        ),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: `Yes, make ${newRole}`,
        cancelButtonText: "Cancel",
        confirmButtonColor: newRole === "admin" ? "#ef4444" : "#3b82f6",
        cancelButtonColor: "#6b7280",
        background: "#ffffff",
        customClass: {
          popup: "rounded-2xl shadow-2xl border border-gray-200",
          confirmButton: "px-6 py-3 rounded-xl font-semibold shadow-lg",
          cancelButton:
            "px-6 py-3 rounded-xl font-semibold border border-gray-300",
        },
        buttonsStyling: false,
        reverseButtons: true,
      });

      if (!result.isConfirmed) {
        setUpdatingUser(null);
        return;
      }

      // You'll need to create this endpoint in your backend
      const response = await fetch(`${API_BASE}/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        // Update local state
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, role: newRole } : user
          )
        );

        Swal.fire({
          title: "✅ Success!",
          text: `User role updated to ${newRole}`,
          icon: "success",
          confirmButtonText: "OK",
          background: "#ffffff",
          customClass: {
            popup: "rounded-2xl shadow-2xl border border-green-200",
          },
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to update user role");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      Swal.fire({
        title: "❌ Error!",
        text: error.message || "Failed to update user role",
        icon: "error",
        confirmButtonText: "OK",
        background: "#ffffff",
        customClass: {
          popup: "rounded-2xl shadow-2xl border border-red-200",
        },
      });
    } finally {
      setUpdatingUser(null);
    }
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { color: "bg-red-100 text-red-800 border-red-200", icon: "⚡" },
      moderator: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: "🛠️",
      },
      user: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: "👤",
      },
    };

    const config = roleConfig[role] || roleConfig.user;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}
      >
        <span className="mr-1">{config.icon}</span>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const getMembershipBadge = (membership) => {
    if (membership?.status === "premium") {
      return (
        <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full border border-yellow-200">
          ⭐ Premium
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full border border-gray-200">
        Free
      </span>
    );
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Manage Users
          </h2>
          <p className="text-gray-600">User management and role assignment</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-6 text-center border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">
              {users.length}
            </div>
            <div className="text-sm text-purple-700">Total Users</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 text-center border border-green-200">
            <div className="text-2xl font-bold text-green-600">
              {users.filter((u) => u.role === "user").length}
            </div>
            <div className="text-sm text-green-700">Regular Users</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl p-6 text-center border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">
              {users.filter((u) => u.role === "moderator").length}
            </div>
            <div className="text-sm text-blue-700">Moderators</div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-pink-100 rounded-2xl p-6 text-center border border-red-200">
            <div className="text-2xl font-bold text-red-600">
              {users.filter((u) => u.role === "admin").length}
            </div>
            <div className="text-sm text-red-700">Admins</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Search Users
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus:border-red-500 focus:ring-4 focus:ring-red-200 outline-none transition-all duration-300"
              />
            </div>
            <div className="text-sm text-gray-500">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-red-50 to-pink-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-red-900">
                  User Management
                </h3>
                <p className="text-sm text-red-700">
                  Manage user roles and permissions
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-red-600">
                  Sorted by: Registration Date
                </p>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Role & Membership
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Registration Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🔍</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No users found
                      </h3>
                      <p className="text-gray-600">
                        Try adjusting your search criteria
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 transition-colors duration-200 group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={
                              user.photo ||
                              "https://www.w3schools.com/w3images/avatar2.png"
                            }
                            alt={user.name}
                            className="w-12 h-12 rounded-full border border-gray-200 shadow-sm"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-semibold text-gray-900 truncate">
                              {user.name}
                            </h4>
                            <p className="text-sm text-gray-500 truncate">
                              {user.email}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              {getMembershipBadge(user.membership)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          {getRoleBadge(user.role)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="space-y-1">
                          <div>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(user.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-2">
                          {/* Make Moderator Button */}
                          <button
                            onClick={() =>
                              handleRoleUpdate(user._id, "moderator")
                            }
                            disabled={
                              updatingUser === user._id ||
                              user.role === "moderator"
                            }
                            className={`inline-flex items-center justify-center px-3 py-2 text-xs font-medium rounded-lg transition-all duration-300 transform hover:scale-105 ${
                              user.role === "moderator"
                                ? "bg-blue-300 text-white cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600 text-white"
                            }`}
                          >
                            {updatingUser === user._id ? (
                              <svg
                                className="animate-spin -ml-1 mr-2 h-3 w-3 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            ) : (
                              <span className="mr-1">🛠️</span>
                            )}
                            {user.role === "moderator"
                              ? "Is Moderator"
                              : "Make Moderator"}
                          </button>

                          {/* Make Admin Button */}
                          <button
                            onClick={() => handleRoleUpdate(user._id, "admin")}
                            disabled={
                              updatingUser === user._id || user.role === "admin"
                            }
                            className={`inline-flex items-center justify-center px-3 py-2 text-xs font-medium rounded-lg transition-all duration-300 transform hover:scale-105 ${
                              user.role === "admin"
                                ? "bg-red-300 text-white cursor-not-allowed"
                                : "bg-red-500 hover:bg-red-600 text-white"
                            }`}
                          >
                            {updatingUser === user._id ? (
                              <svg
                                className="animate-spin -ml-1 mr-2 h-3 w-3 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            ) : (
                              <span className="mr-1">⚡</span>
                            )}
                            {user.role === "admin" ? "Is Admin" : "Make Admin"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <h4 className="font-semibold text-blue-800 mb-2">
            💡 Role Management Guide
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>
              • <strong>Users</strong> - Can submit products (1 for free,
              unlimited for premium)
            </li>
            <li>
              • <strong>Moderators</strong> - Can review products and manage
              reported content
            </li>
            <li>
              • <strong>Admins</strong> - Full system access including user and
              coupon management
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
