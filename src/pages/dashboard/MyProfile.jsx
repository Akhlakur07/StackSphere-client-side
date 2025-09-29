import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Elements } from "@stripe/react-stripe-js";
import stripePromise from "../../config/stripe";
import MembershipCheckoutForm from "../../components/MembershipCheckoutForm";
import { toast } from "react-toastify";
import Swal from "sweetalert2";


const API_BASE = "http://localhost:3000";

const MyProfile = () => {
  const { user } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);
  const [userProducts, setUserProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user profile
        const profileResponse = await fetch(`${API_BASE}/user-profile/${user?.email}`);
        if (profileResponse.ok) {
          const data = await profileResponse.json();
          setUserProfile(data);
        } else {
          toast.error("Failed to load user profile");
        }

        // Fetch user's products
        const productsResponse = await fetch(`${API_BASE}/products/user/${user?.email}`);
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setUserProducts(productsData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchUserData();
    }
  }, [user?.email]);

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    // Refresh user data to show updated membership status
    window.location.reload();
  };

  const showUpgradeBenefits = () => {
    Swal.fire({
      title: '🚀 Upgrade to Premium',
      html: (
        <div className="text-left">
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-6 mb-4 border border-purple-200">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center">
                <span className="text-2xl text-white">⭐</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Unlock Premium Features</h3>
                <p className="text-gray-600">Get unlimited access for just $9.99/month</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Product Submissions</span>
                <span className="font-semibold text-green-600">Unlimited</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Voting Power</span>
                <span className="font-semibold text-green-600">Enhanced</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Advanced Analytics</span>
                <span className="text-green-500">✅</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Featured Placement</span>
                <span className="text-green-500">✅</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Priority Support</span>
                <span className="text-green-500">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">💡 Why Upgrade?</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Reach more users with unlimited product submissions</li>
              <li>• Get better visibility with enhanced voting power</li>
              <li>• Track performance with detailed analytics</li>
              <li>• Stand out with featured placement opportunities</li>
            </ul>
          </div>
        </div>
      ),
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Upgrade Now - $9.99',
      cancelButtonText: 'Maybe Later',
      confirmButtonColor: '#8b5cf6',
      cancelButtonColor: '#6b7280',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-2xl shadow-2xl border border-purple-200',
        confirmButton: 'px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300',
        cancelButton: 'px-6 py-3 rounded-xl font-semibold border border-gray-300 hover:bg-gray-50 transition-all duration-300'
      },
      buttonsStyling: false,
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        setShowPaymentModal(true);
      }
    });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  const membershipStatus = userProfile?.membership?.status || "none";
  const isPremium = membershipStatus === "premium";

  // Calculate stats from user products
  const totalVotes = userProducts.reduce((total, product) => total + product.votes, 0);
  const acceptedProducts = userProducts.filter(p => p.status === 'accepted').length;
  const featuredProducts = userProducts.filter(p => p.featured).length;

  return (
    <div className="p-6 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h2>
          <p className="text-gray-600">
            Manage your account information and membership
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 shadow-lg border border-purple-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Personal Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-200">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center shadow-lg">
                      {user?.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt="Profile"
                          className="w-20 h-20 rounded-full"
                        />
                      ) : (
                        <span className="text-white text-2xl font-bold">
                          {user?.displayName?.charAt(0) || "U"}
                        </span>
                      )}
                    </div>
                    {isPremium && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-xs text-white">⭐</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <p className="text-2xl font-bold text-gray-900">
                        {user?.displayName || "User"}
                      </p>
                      {isPremium && (
                        <span className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full border border-yellow-200">
                          ⭐ Premium
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-lg">{user?.email}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>Role: <span className="font-medium capitalize">{userProfile?.role || "user"}</span></span>
                      <span>•</span>
                      <span>Member since: <span className="font-medium">{userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : "Recently"}</span></span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Account Status</p>
                    <p className={`text-lg font-semibold ${isPremium ? "text-green-600" : "text-purple-600"}`}>
                      {isPremium ? "Premium Member" : "Free Account"}
                    </p>
                    {!isPremium && (
                      <p className="text-xs text-gray-500 mt-1">
                        Upgrade for unlimited features
                      </p>
                    )}
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Product Limit</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {isPremium ? "Unlimited" : `${userProducts.length}/1`}
                    </p>
                    {!isPremium && (
                      <p className="text-xs text-gray-500 mt-1">
                        {userProducts.length >= 1 ? "Limit reached" : "1 product allowed"}
                      </p>
                    )}
                  </div>
                </div>

                {userProfile?.bio && (
                  <div className="p-4 bg-white rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Bio</p>
                    <p className="text-gray-900">{userProfile.bio}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Account Stats */}
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg border border-blue-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Account Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
                  <div className="text-2xl font-bold text-purple-600">{userProducts.length}</div>
                  <div className="text-sm text-gray-600">Total Products</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
                  <div className="text-2xl font-bold text-green-600">{acceptedProducts}</div>
                  <div className="text-sm text-gray-600">Accepted</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
                  <div className="text-2xl font-bold text-blue-600">{totalVotes}</div>
                  <div className="text-sm text-gray-600">Total Votes</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
                  <div className="text-2xl font-bold text-yellow-600">{featuredProducts}</div>
                  <div className="text-sm text-gray-600">Featured</div>
                </div>
              </div>
            </div>
          </div>

          {/* Membership Section */}
          <div className="space-y-6">
            <div
              className={`rounded-2xl p-6 shadow-lg border ${
                isPremium
                  ? "bg-gradient-to-br from-green-50 to-emerald-100 border-green-200"
                  : "bg-gradient-to-br from-white to-orange-50 border-orange-100"
              }`}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Membership
              </h3>

              <div className="text-center space-y-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-lg ${
                    isPremium
                      ? "bg-gradient-to-r from-green-400 to-emerald-400"
                      : "bg-gradient-to-r from-orange-400 to-yellow-400"
                  }`}
                >
                  <span className="text-white text-2xl">
                    {isPremium ? "⭐" : "🔒"}
                  </span>
                </div>

                <div>
                  <p className="text-gray-600 mb-2">Current Plan</p>
                  <p
                    className={`text-2xl font-bold ${
                      isPremium ? "text-green-600" : "text-gray-900"
                    }`}
                  >
                    {isPremium ? "Premium" : "Free"}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Product Submissions</span>
                    <span className="font-semibold">
                      {isPremium ? "Unlimited" : "1 / month"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Voting Power</span>
                    <span className="font-semibold">
                      {isPremium ? "Enhanced" : "Basic"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Analytics</span>
                    <span
                      className={`font-semibold ${
                        isPremium ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {isPremium ? "✅" : "❌"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Featured Placement</span>
                    <span
                      className={`font-semibold ${
                        isPremium ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {isPremium ? "✅" : "❌"}
                    </span>
                  </div>
                </div>

                {!isPremium ? (
                  <div className="space-y-3">
                    <button
                      onClick={showUpgradeBenefits}
                      className="w-full bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
                    >
                      Upgrade to Premium - $9.99
                    </button>
                    <p className="text-xs text-gray-500">
                      Unlock unlimited submissions and advanced features
                    </p>
                  </div>
                ) : (
                  <div className="bg-green-100 border border-green-200 rounded-2xl p-4">
                    <div className="flex items-center justify-center space-x-2 text-green-700 mb-2">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-semibold">Status: Active</span>
                    </div>
                    {userProfile?.membership?.purchasedAt && (
                      <p className="text-xs text-green-600 text-center">
                        Member since {new Date(userProfile.membership.purchasedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 shadow-lg border border-purple-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = '/dashboard/add-product'}
                  disabled={!isPremium && userProducts.length >= 1}
                  className={`w-full text-left p-3 rounded-xl border transition-all duration-300 ${
                    !isPremium && userProducts.length >= 1
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">➕</span>
                    <div>
                      <div className="font-semibold">Add New Product</div>
                      <div className="text-xs text-gray-500">
                        {!isPremium && userProducts.length >= 1 
                          ? 'Upgrade to add more' 
                          : 'Submit your next great idea'
                        }
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => window.location.href = '/dashboard/my-products'}
                  className="w-full text-left p-3 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-600 transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">📦</span>
                    <div>
                      <div className="font-semibold">View My Products</div>
                      <div className="text-xs text-gray-500">
                        Manage your submissions ({userProducts.length})
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stripe Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Upgrade to Premium</h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <Elements stripe={stripePromise}>
                <MembershipCheckoutForm
                  user={user}
                  amount={9.99}
                  onSuccess={handlePaymentSuccess}
                  onClose={() => setShowPaymentModal(false)}
                />
              </Elements>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;