import React from 'react';

const StatisticsPage = () => {
  return (
    <div className="p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Platform Statistics</h2>
          <p className="text-gray-600">Analytics and insights dashboard</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl p-8 text-center border border-blue-200">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white">📊</span>
          </div>
          <h3 className="text-2xl font-bold text-blue-600 mb-2">Statistics Dashboard</h3>
          <p className="text-blue-700 mb-4">
            Comprehensive analytics and insights will be displayed here.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white rounded-xl p-4 border border-blue-200">
              <div className="text-lg font-bold text-blue-600">1,250</div>
              <div className="text-sm text-blue-700">Total Users</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-blue-200">
              <div className="text-lg font-bold text-green-600">543</div>
              <div className="text-sm text-green-700">Products</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-blue-200">
              <div className="text-lg font-bold text-purple-600">$12.5K</div>
              <div className="text-sm text-purple-700">Revenue</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-blue-200">
              <div className="text-lg font-bold text-orange-600">23</div>
              <div className="text-sm text-orange-700">Pending</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;