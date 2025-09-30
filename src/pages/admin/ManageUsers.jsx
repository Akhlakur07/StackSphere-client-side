import React from 'react';

const ManageUsers = () => {
  return (
    <div className="p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Manage Users</h2>
          <p className="text-gray-600">User management and role assignment</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8 text-center border border-green-200">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white">👥</span>
          </div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">User Management</h3>
          <p className="text-green-700 mb-4">
            User management interface with role assignment capabilities.
          </p>
          <div className="max-w-2xl mx-auto bg-white rounded-xl p-6 border border-green-200">
            <p className="text-gray-600">
              User table with actions (Make Moderator, Make Admin, etc.) will be implemented here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;