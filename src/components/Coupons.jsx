/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const API_BASE = "http://localhost:3000";

const Coupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedCode, setCopiedCode] = useState(null);

    useEffect(() => {
        fetchActiveCoupons();
    }, []);

    const fetchActiveCoupons = async () => {
        try {
            const response = await fetch(`${API_BASE}/admin/coupons`);
            if (response.ok) {
                const data = await response.json();
                // Filter active coupons that haven't expired
                const activeCoupons = data.filter(coupon => 
                    coupon.isActive && new Date(coupon.expiryDate) > new Date()
                );
                setCoupons(activeCoupons.slice(0, 6)); // Show only 6 coupons
            }
        } catch (error) {
            console.error('Error fetching coupons:', error);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const getDaysRemaining = (expiryDate) => {
        const now = new Date();
        const expiry = new Date(expiryDate);
        const diffTime = expiry - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { 
            opacity: 0, 
            y: 50,
            scale: 0.8
        },
        visible: { 
            opacity: 1, 
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        },
        hover: {
            y: -10,
            scale: 1.05,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 17
            }
        }
    };

    if (loading) {
        return (
            <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50/30 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="animate-pulse inline-flex items-center space-x-2 bg-purple-100 text-transparent px-6 py-2 rounded-full text-sm font-semibold mb-4">
                            <span>🎫</span>
                            <span>Special Offers</span>
                        </div>
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-400 to-gray-300 bg-clip-text text-transparent mb-4">
                            Exclusive Deals
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="bg-white rounded-3xl shadow-lg p-6 animate-pulse">
                                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
                                <div className="h-10 bg-gray-200 rounded-xl"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (coupons.length === 0) {
        return null; // Don't show section if no coupons
    }

    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50/30 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-100/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-100/10 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-full text-sm font-bold mb-6 shadow-2xl shadow-purple-500/30">
                        <span className="text-lg">🎫</span>
                        <span>Special Offers</span>
                        <span className="text-lg">💰</span>
                    </div>
                    <h2 className="text-5xl font-black text-gray-900 mb-6">
                        Exclusive <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Deals</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Limited time offers and discounts to help you get started with premium features
                    </p>
                </motion.div>

                {/* Coupons Grid */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
                >
                    {coupons.map((coupon, index) => (
                        <motion.div
                            key={coupon._id}
                            variants={cardVariants}
                            whileHover="hover"
                            className="relative group"
                        >
                            {/* Main Card */}
                            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20 hover:shadow-3xl transition-all duration-500">
                                {/* Gradient Border Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                {/* Coupon Header */}
                                <div className="relative p-6 border-b border-gray-100/50">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                                                <span className="text-white font-bold text-sm">%</span>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black text-gray-900 font-mono">
                                                    {coupon.code}
                                                </h3>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full border border-green-200 font-medium">
                                                        Active
                                                    </span>
                                                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full border border-blue-200 font-medium">
                                                        ${coupon.discountAmount} OFF
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {coupon.description}
                                    </p>
                                </div>

                                {/* Coupon Details */}
                                <div className="p-6 space-y-4">
                                    {/* Usage Info */}
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Uses Left:</span>
                                        <span className="font-semibold text-gray-700">
                                            {coupon.maxUses ? 
                                                `${coupon.maxUses - (coupon.usedCount || 0)} remaining` : 
                                                'Unlimited'
                                            }
                                        </span>
                                    </div>

                                    {/* Minimum Order */}
                                    {coupon.minOrderAmount && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">Min Order:</span>
                                            <span className="font-semibold text-gray-700">
                                                ${coupon.minOrderAmount}
                                            </span>
                                        </div>
                                    )}

                                    {/* Expiry Countdown */}
                                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-semibold text-orange-800">Expires in</p>
                                                <p className="text-xs text-orange-600">
                                                    {new Date(coupon.expiryDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-2xl font-black ${
                                                    getDaysRemaining(coupon.expiryDate) <= 3 ? 'text-red-500' : 'text-orange-500'
                                                }`}>
                                                    {getDaysRemaining(coupon.expiryDate)}
                                                </p>
                                                <p className="text-xs text-orange-600 font-medium">days</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Copy Code Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => copyToClipboard(coupon.code)}
                                        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-purple-500/25 transition-all duration-300 flex items-center justify-center space-x-3 group/btn"
                                    >
                                        {copiedCode === coupon.code ? (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                                <span>Copy Code</span>
                                            </>
                                        )}
                                    </motion.button>
                                </div>

                                {/* Corner Accents */}
                                <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-tr-3xl"></div>
                                <div className="absolute bottom-0 left-0 w-8 h-8 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-bl-3xl"></div>
                            </div>

                            {/* Floating Particles */}
                            <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-ping"></div>
                            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200 animate-ping"></div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                </motion.div>
            </div>

            {/* Custom Animations */}
            <style jsx>{`
                .shadow-3xl {
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
};

export default Coupons;