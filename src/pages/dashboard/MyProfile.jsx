import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Elements } from "@stripe/react-stripe-js";
import stripePromise from "../../config/stripe";
import MembershipCheckoutForm from "../../components/MembershipCheckoutForm";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:3000";

const MyProfile = () => {
  const { user } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Use the correct endpoint that exists in your backend
        const response = await fetch(`${API_BASE}/users/${user?.email}`);
        if (response.ok) {
          const data = await response.json();
          setUserProfile(data);
        } else {
          toast.error("Failed to load user profile");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchUserProfile();
    }
  }, [user?.email]);

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    // Refresh user profile to show updated membership status
    window.location.reload();
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

  return (
    <div className="p-6 sm:p-8">
      <div className="max-w-4xl mx-auto">
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
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center shadow-lg">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-16 h-16 rounded-full"
                      />
                    ) : (
                      <span className="text-white text-2xl font-bold">
                        {user?.displayName?.charAt(0) || "U"}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {user?.displayName || "User"}
                    </p>
                    <p className="text-gray-600">{user?.email}</p>
                    <p className="text-sm text-gray-500">
                      Role:{" "}
                      <span className="font-medium capitalize">
                        {userProfile?.role || "user"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-semibold text-gray-900">
                      {userProfile?.createdAt
                        ? new Date(userProfile.createdAt).toLocaleDateString()
                        : "Recently"}
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-600">Account Type</p>
                    <p
                      className={`font-semibold ${
                        isPremium ? "text-green-600" : "text-purple-600"
                      }`}
                    >
                      {isPremium ? "Premium Member" : "Free Account"}
                    </p>
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
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
                  >
                    Upgrade to Premium - $9.99
                  </button>
                ) : (
                  <div className="bg-green-100 border border-green-200 rounded-2xl p-4">
                    <div className="flex items-center justify-center space-x-2 text-green-700">
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
                      <span className="font-semibold">Status: Verified</span>
                    </div>
                    {userProfile?.membership?.purchasedAt && (
                      <p className="text-xs text-green-600 mt-1">
                        Since{" "}
                        {new Date(
                          userProfile.membership.purchasedAt
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}

                {!isPremium && (
                  <p className="text-xs text-gray-500">
                    Unlock unlimited submissions and advanced features
                  </p>
                )}
              </div>
            </div>

            {/* Account Stats */}
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg border border-blue-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Account Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Products Submitted</span>
                  <span className="font-semibold text-gray-900">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Votes</span>
                  <span className="font-semibold text-gray-900">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Products Featured</span>
                  <span className="font-semibold text-gray-900">0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stripe Payment Modal */}
      {showPaymentModal && (
        <Elements stripe={stripePromise}>
          <MembershipCheckoutForm
            user={user}
            amount={9.99}
            onSuccess={handlePaymentSuccess}
            onClose={() => setShowPaymentModal(false)}
          />
        </Elements>
      )}
    </div>
  );
};

export default MyProfile;
