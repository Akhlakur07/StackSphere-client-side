import React from 'react';

const ManageCoupons = () => {
  return (
    <div className="p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Manage Coupons</h2>
          <p className="text-gray-600">Coupon and discount management</p>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-2xl p-8 text-center border border-yellow-200">
          <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white">🎫</span>
          </div>
          <h3 className="text-2xl font-bold text-yellow-600 mb-2">Coupon Management</h3>
          <p className="text-yellow-700 mb-4">
            Create, edit, and manage discount coupons for users.
          </p>
          <div className="max-w-2xl mx-auto bg-white rounded-xl p-6 border border-yellow-200">
            <p className="text-gray-600">
              Coupon creation form and management table will be implemented here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCoupons;