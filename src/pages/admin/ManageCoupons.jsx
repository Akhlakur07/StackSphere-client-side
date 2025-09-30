import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const API_BASE = "http://localhost:3000";

const ManageCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [form, setForm] = useState({
    code: '',
    description: '',
    discountAmount: '',
    expiryDate: '',
    maxUses: '',
    minOrderAmount: ''
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      console.log("Fetching coupons...");
      
      const response = await fetch(`${API_BASE}/admin/coupons`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch coupons');
      }
      
      const data = await response.json();
      console.log("Received coupons:", data);
      setCoupons(data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to load coupons',
        icon: 'error',
        confirmButtonText: 'OK',
        background: '#ffffff',
        customClass: {
          popup: 'rounded-2xl shadow-2xl border border-red-200'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setForm({
      code: '',
      description: '',
      discountAmount: '',
      expiryDate: '',
      maxUses: '',
      minOrderAmount: ''
    });
    setEditingCoupon(null);
    setShowAddForm(false);
  };

  const validateForm = () => {
    if (!form.code.trim()) {
      return 'Coupon code is required';
    }
    if (!form.description.trim()) {
      return 'Description is required';
    }
    if (!form.discountAmount || parseFloat(form.discountAmount) <= 0) {
      return 'Discount amount must be greater than 0';
    }
    if (!form.expiryDate) {
      return 'Expiry date is required';
    }
    if (new Date(form.expiryDate) <= new Date()) {
      return 'Expiry date must be in the future';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const error = validateForm();
    if (error) {
      Swal.fire({
        title: 'Validation Error',
        text: error,
        icon: 'error',
        confirmButtonText: 'OK',
        background: '#ffffff',
        customClass: {
          popup: 'rounded-2xl shadow-2xl border border-red-200'
        }
      });
      return;
    }

    try {
      const couponData = {
        code: form.code.toUpperCase().trim(),
        description: form.description.trim(),
        discountAmount: parseFloat(form.discountAmount),
        expiryDate: form.expiryDate,
        maxUses: form.maxUses ? parseInt(form.maxUses) : null,
        minOrderAmount: form.minOrderAmount ? parseFloat(form.minOrderAmount) : null,
        isActive: true
      };

      const url = editingCoupon 
        ? `${API_BASE}/admin/coupons/${editingCoupon._id}`
        : `${API_BASE}/admin/coupons`;

      const method = editingCoupon ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(couponData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save coupon');
      }

      // eslint-disable-next-line no-unused-vars
      const result = await response.json();

      Swal.fire({
        title: '✅ Success!',
        text: editingCoupon ? 'Coupon updated successfully!' : 'Coupon created successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
        background: '#ffffff',
        customClass: {
          popup: 'rounded-2xl shadow-2xl border border-green-200'
        }
      });

      resetForm();
      fetchCoupons(); // Refresh the list
    } catch (error) {
      console.error('Error saving coupon:', error);
      Swal.fire({
        title: '❌ Error!',
        text: error.message || 'Failed to save coupon',
        icon: 'error',
        confirmButtonText: 'OK',
        background: '#ffffff',
        customClass: {
          popup: 'rounded-2xl shadow-2xl border border-red-200'
        }
      });
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setForm({
      code: coupon.code,
      description: coupon.description,
      discountAmount: coupon.discountAmount.toString(),
      expiryDate: coupon.expiryDate.split('T')[0], // Format for date input
      maxUses: coupon.maxUses?.toString() || '',
      minOrderAmount: coupon.minOrderAmount?.toString() || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (couponId) => {
    const result = await Swal.fire({
      title: 'Delete Coupon?',
      html: (
        <div className="text-left">
          <p className="text-gray-600 mb-4">You are about to permanently delete this coupon.</p>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <p className="text-sm text-red-600 font-medium">
              ⚠️ This action cannot be undone!
            </p>
          </div>
        </div>
      ),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-2xl shadow-2xl border border-gray-200',
        confirmButton: 'px-6 py-3 rounded-xl font-semibold shadow-lg',
        cancelButton: 'px-6 py-3 rounded-xl font-semibold border border-gray-300'
      },
      buttonsStyling: false,
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setDeletingId(couponId);

    try {
      const response = await fetch(`${API_BASE}/admin/coupons/${couponId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete coupon');
      }

      Swal.fire({
        title: '🗑️ Deleted!',
        text: 'Coupon has been permanently removed',
        icon: 'success',
        confirmButtonText: 'OK',
        background: '#ffffff',
        customClass: {
          popup: 'rounded-2xl shadow-2xl border border-green-200'
        }
      });

      fetchCoupons(); // Refresh the list
    } catch (error) {
      console.error('Error deleting coupon:', error);
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Failed to delete coupon',
        icon: 'error',
        confirmButtonText: 'OK',
        background: '#ffffff',
        customClass: {
          popup: 'rounded-2xl shadow-2xl border border-red-200'
        }
      });
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (coupon) => {
    const now = new Date();
    const expiryDate = new Date(coupon.expiryDate);
    
    if (!coupon.isActive) {
      return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full border border-red-200">Inactive</span>;
    }
    
    if (expiryDate < now) {
      return <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full border border-gray-200">Expired</span>;
    }
    
    if (coupon.usedCount >= coupon.maxUses && coupon.maxUses) {
      return <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full border border-orange-200">Limit Reached</span>;
    }
    
    return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full border border-green-200">Active</span>;
  };

  const getDaysRemaining = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Manage Coupons</h2>
          <p className="text-gray-600">Create and manage discount coupons for users</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-6 text-center border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">{coupons.length}</div>
            <div className="text-sm text-purple-700">Total Coupons</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 text-center border border-green-200">
            <div className="text-2xl font-bold text-green-600">
              {coupons.filter(c => c.isActive && new Date(c.expiryDate) > new Date()).length}
            </div>
            <div className="text-sm text-green-700">Active Coupons</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl p-6 text-center border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">
              {coupons.reduce((total, coupon) => total + (coupon.usedCount || 0), 0)}
            </div>
            <div className="text-sm text-blue-700">Total Uses</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-2xl p-6 text-center border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">
              ${coupons.reduce((total, coupon) => total + (coupon.discountAmount * (coupon.usedCount || 0)), 0).toFixed(2)}
            </div>
            <div className="text-sm text-yellow-700">Total Discounts</div>
          </div>
        </div>

        {/* Add Coupon Button */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Coupon Management</h3>
            <p className="text-sm text-gray-600">Create and manage discount codes</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-2xl shadow-lg shadow-red-500/25 transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
          >
            <span>+</span>
            <span>Add New Coupon</span>
          </button>
        </div>

        {/* Add/Edit Coupon Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
              </h3>
              <button
                onClick={resetForm}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Coupon Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  name="code"
                  value={form.code}
                  onChange={handleInputChange}
                  placeholder="e.g., WELCOME20"
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus:border-red-500 focus:ring-4 focus:ring-red-200 outline-none transition-all duration-300"
                  required
                />
              </div>

              {/* Discount Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Amount ($) *
                </label>
                <input
                  type="number"
                  name="discountAmount"
                  value={form.discountAmount}
                  onChange={handleInputChange}
                  placeholder="e.g., 10.00"
                  min="0.01"
                  step="0.01"
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus:border-red-500 focus:ring-4 focus:ring-red-200 outline-none transition-all duration-300"
                  required
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={form.expiryDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus:border-red-500 focus:ring-4 focus:ring-red-200 outline-none transition-all duration-300"
                  required
                />
              </div>

              {/* Max Uses */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Uses (Optional)
                </label>
                <input
                  type="number"
                  name="maxUses"
                  value={form.maxUses}
                  onChange={handleInputChange}
                  placeholder="e.g., 100 (leave empty for unlimited)"
                  min="1"
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus:border-red-500 focus:ring-4 focus:ring-red-200 outline-none transition-all duration-300"
                />
              </div>

              {/* Minimum Order Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Order Amount (Optional)
                </label>
                <input
                  type="number"
                  name="minOrderAmount"
                  value={form.minOrderAmount}
                  onChange={handleInputChange}
                  placeholder="e.g., 25.00"
                  min="0"
                  step="0.01"
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus:border-red-500 focus:ring-4 focus:ring-red-200 outline-none transition-all duration-300"
                />
              </div>

              {/* Description - Full Width */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Describe what this coupon offers..."
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus:border-red-500 focus:ring-4 focus:ring-red-200 outline-none transition-all duration-300 resize-none"
                  required
                />
              </div>

              {/* Form Actions */}
              <div className="md:col-span-2 flex space-x-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-2xl shadow-lg shadow-red-500/25 transform hover:scale-105 transition-all duration-300"
                >
                  {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Coupons Grid */}
        {coupons.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🎫</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Coupons Yet</h3>
            <p className="text-gray-600 mb-6">Create your first coupon to offer discounts to users</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-2xl shadow-lg shadow-red-500/25 transform hover:scale-105 transition-all duration-300"
            >
              Create Your First Coupon
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((coupon) => (
              <div key={coupon._id} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 group">
                {/* Coupon Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-sm">%</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 font-mono">
                        {coupon.code}
                      </h3>
                      {getStatusBadge(coupon)}
                    </div>
                  </div>
                </div>

                {/* Coupon Details */}
                <div className="space-y-3 mb-4">
                  <p className="text-gray-600 text-sm">{coupon.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Discount:</span>
                    <span className="font-bold text-green-600">${coupon.discountAmount}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Expires:</span>
                    <span className="font-medium text-gray-700">
                      {new Date(coupon.expiryDate).toLocaleDateString()}
                    </span>
                  </div>

                  {coupon.maxUses && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Uses:</span>
                      <span className="font-medium text-gray-700">
                        {coupon.usedCount || 0} / {coupon.maxUses}
                      </span>
                    </div>
                  )}

                  {coupon.minOrderAmount && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Min Order:</span>
                      <span className="font-medium text-gray-700">
                        ${coupon.minOrderAmount}
                      </span>
                    </div>
                  )}

                  {/* Days Remaining */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-700">Days Remaining:</span>
                      <span className={`font-bold ${
                        getDaysRemaining(coupon.expiryDate) <= 7 ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {getDaysRemaining(coupon.expiryDate)} days
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(coupon)}
                    className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(coupon._id)}
                    disabled={deletingId === coupon._id}
                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    {deletingId === coupon._id ? (
                      <svg className="animate-spin mx-auto h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      'Delete'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help Text */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h4 className="font-semibold text-blue-800 mb-3">💡 Coupon Management Tips</h4>
          <ul className="text-sm text-blue-700 space-y-2">
            <li>• <strong>Coupon Codes</strong> should be unique and easy to remember</li>
            <li>• Set <strong>Maximum Uses</strong> to limit how many times a coupon can be used</li>
            <li>• Use <strong>Minimum Order Amount</strong> to ensure meaningful purchases</li>
            <li>• Monitor coupon usage and expiry dates regularly</li>
            <li>• Consider creating seasonal or promotional coupons for special events</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManageCoupons;