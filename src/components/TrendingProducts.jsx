import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const API_BASE = "http://localhost:3000";

const TrendingProducts = () => {
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [upvoting, setUpvoting] = useState({});
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTrendingProducts();
    }, []);

    const fetchTrendingProducts = async () => {
        try {
            const response = await fetch(`${API_BASE}/products/trending`);
            if (response.ok) {
                const data = await response.json();
                setTrendingProducts(data);
            } else {
                toast.error('Failed to load trending products');
            }
        } catch (error) {
            console.error('Error fetching trending products:', error);
            toast.error('Failed to load trending products');
        } finally {
            setLoading(false);
        }
    };

    const handleUpvote = async (productId, productOwnerEmail) => {
        if (!user) {
            toast.info('Please login to upvote products');
            navigate('/login');
            return;
        }

        if (productOwnerEmail === user.email) {
            toast.info("You can't upvote your own product");
            return;
        }

        setUpvoting(prev => ({ ...prev, [productId]: true }));

        try {
            const response = await fetch(`${API_BASE}/products/${productId}/upvote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userEmail: user.email }),
            });

            if (response.ok) {
                const updatedProduct = await response.json();
                setTrendingProducts(prev => 
                    prev.map(product => 
                        product._id === productId ? updatedProduct : product
                    )
                );
                toast.success('Upvoted successfully!');
            } else {
                const error = await response.json();
                toast.error(error.message || 'Failed to upvote');
            }
        } catch (error) {
            console.error('Error upvoting:', error);
            toast.error('Failed to upvote');
        } finally {
            setUpvoting(prev => ({ ...prev, [productId]: false }));
        }
    };

    if (loading) {
        return (
            <section className="py-20 bg-gradient-to-br from-white via-orange-50/30 to-red-50/20 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-200/20 rounded-full blur-3xl"></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <div className="animate-pulse inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 text-transparent px-6 py-2 rounded-full text-sm font-semibold mb-4 border border-orange-200/30">
                            <span>🔥</span>
                            <span>Community Favorites</span>
                        </div>
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-400 to-gray-300 bg-clip-text text-transparent mb-4">
                            Trending Products
                        </h2>
                        <div className="h-4 bg-gray-200 rounded-full w-64 mx-auto mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded-full w-48 mx-auto"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 animate-pulse">
                                <div className="h-48 bg-gray-200 rounded-2xl mb-4"></div>
                                <div className="h-6 bg-gray-200 rounded mb-3"></div>
                                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                                    </div>
                                    <div className="w-20 h-8 bg-gray-200 rounded-xl"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (trendingProducts.length === 0) {
        return (
            <section className="py-20 bg-gradient-to-br from-white via-orange-50/30 to-red-50/20 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-200/20 rounded-full blur-3xl"></div>
                </div>
                
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border border-white/20">
                        <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                            <span className="text-6xl">🌋</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">No Trending Products Yet</h3>
                        <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                            Be the first to discover and upvote amazing products! The community is waiting to see what's hot.
                        </p>
                        <Link
                            to="/products"
                            className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/25 transform hover:scale-105 transition-all duration-300"
                        >
                            <span>Explore All Products</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 bg-gradient-to-br from-white via-orange-50/30 to-red-50/20 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl animate-float"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-100/10 rounded-full blur-3xl animate-pulse"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header - Enhanced */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full text-sm font-bold mb-6 shadow-2xl shadow-orange-500/30 transform hover:scale-105 transition-transform duration-300 cursor-default">
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-sm">🔥</span>
                        </div>
                        <span>Community Favorites</span>
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-sm">🔥</span>
                        </div>
                    </div>
                    <h2 className="text-5xl font-black text-gray-900 mb-6">
                        Trending <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Now</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Discover what's capturing the community's attention. These products are gaining momentum 
                        and shaping the future of technology right now.
                    </p>
                </div>

                {/* Trending Products Grid - Enhanced */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {trendingProducts.map((product, index) => {
                        const canUpvote = user && user.email !== product.owner.email;
                        const isUpvoting = upvoting[product._id];
                        const isTopProduct = index < 3;
                        const isHotProduct = product.votes >= 10;

                        return (
                            <div 
                                key={product._id} 
                                className="group relative"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Card Container */}
                                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20 hover:border-orange-200/50 transition-all duration-500 transform hover:-translate-y-2 relative">
                                    {/* Gradient Overlay on Hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-red-500/0 group-hover:from-orange-500/5 group-hover:to-red-500/5 transition-all duration-500 rounded-3xl"></div>
                                    
                                    {/* Premium Ranking Badge */}
                                    {isTopProduct && (
                                        <div className={`absolute top-4 left-4 z-20 w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-lg shadow-2xl ${
                                            index === 0 
                                                ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-yellow-500/40' 
                                                : index === 1 
                                                ? 'bg-gradient-to-br from-gray-400 to-gray-600 shadow-gray-500/40'
                                                : 'bg-gradient-to-br from-orange-400 to-red-500 shadow-orange-500/40'
                                        }`}>
                                            #{index + 1}
                                        </div>
                                    )}

                                    {/* Hot Product Flare */}
                                    {isHotProduct && (
                                        <div className="absolute top-4 right-4 z-20">
                                            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-2xl shadow-red-500/30 flex items-center space-x-1 animate-pulse">
                                                <span className="text-sm">🔥</span>
                                                <span>HOT</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Product Image with Enhanced Styling */}
                                    <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-orange-50/30">
                                        <div className="aspect-w-16 aspect-h-10 relative">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-52 object-contain p-6 group-hover:scale-110 transition-transform duration-700 ease-out"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Trending+Now';
                                                }}
                                            />
                                            {/* Shine Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                        </div>
                                    </div>

                                    {/* Product Content */}
                                    <div className="p-6 relative z-10">
                                        {/* Product Name */}
                                        <Link 
                                            to={`/product/${product._id}`}
                                            className="block mb-4 group-hover:text-orange-600 transition-colors duration-300"
                                        >
                                            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 hover:text-orange-600 leading-tight">
                                                {product.name}
                                            </h3>
                                        </Link>

                                        {/* Enhanced Tags */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {product.tags?.slice(0, 3).map((tag, tagIndex) => (
                                                <span
                                                    key={tagIndex}
                                                    className="px-3 py-1 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 rounded-lg text-xs font-semibold border border-orange-200/50 shadow-sm"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Enhanced Product Footer */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100/50">
                                            {/* Owner Info with Enhanced Styling */}
                                            <div className="flex items-center space-x-3">
                                                <div className="relative">
                                                    <img
                                                        src={product.owner.photo || "https://www.w3schools.com/w3images/avatar2.png"}
                                                        alt={product.owner.name}
                                                        className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                                                    />
                                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-900">{product.owner.name}</p>
                                                    <p className="text-xs text-gray-500">Creator</p>
                                                </div>
                                            </div>

                                            {/* Enhanced Upvote Button with Vote Count */}
                                            <div className="flex items-center space-x-3">
                                                {/* Vote Count with Pulse Animation for Hot Products */}
                                                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200/50 ${
                                                    isHotProduct ? 'animate-pulse' : ''
                                                }`}>
                                                    <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-sm font-bold text-orange-700">{product.votes || 0}</span>
                                                </div>

                                                {/* Upvote Button */}
                                                <button
                                                    onClick={() => handleUpvote(product._id, product.owner.email)}
                                                    disabled={isUpvoting || !canUpvote}
                                                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold transition-all duration-300 transform hover:scale-110 shadow-lg ${
                                                        canUpvote
                                                            ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-orange-500/25'
                                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-gray-200/25'
                                                    } ${isUpvoting ? 'animate-pulse' : ''}`}
                                                >
                                                    {isUpvoting ? (
                                                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                    ) : (
                                                        <>
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                                            </svg>
                                                            <span className="text-sm">Vote</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Corner Accents */}
                                    <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-orange-500/10 to-transparent rounded-tr-3xl"></div>
                                    <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-red-500/10 to-transparent rounded-bl-3xl"></div>

                                    {/* Momentum Indicator */}
                                    {isHotProduct && (
                                        <div className="absolute bottom-4 right-4">
                                            <div className="flex space-x-1">
                                                {[...Array(3)].map((_, i) => (
                                                    <div 
                                                        key={i}
                                                        className="w-1 h-1 bg-orange-400 rounded-full animate-bounce"
                                                        style={{ animationDelay: `${i * 0.2}s` }}
                                                    ></div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Floating Animation */}
                                <style jsx>{`
                                    .group:nth-child(odd) {
                                        animation: float 6s ease-in-out infinite;
                                    }
                                    .group:nth-child(even) {
                                        animation: float 6s ease-in-out infinite 1s;
                                    }
                                    @keyframes float {
                                        0%, 100% { transform: translateY(0px); }
                                        50% { transform: translateY(-8px); }
                                    }
                                `}</style>
                            </div>
                        );
                    })}
                </div>

                {/* Enhanced CTA */}
                <div className="text-center">
                    <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-sm rounded-3xl p-8 border border-orange-200/30 shadow-2xl">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Want to See More Trending Content?
                        </h3>
                        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                            Explore thousands of products and discover what's capturing the community's attention. 
                            Your next favorite innovation is just a click away.
                        </p>
                        <Link
                            to="/products"
                            className="inline-flex items-center space-x-4 px-10 py-5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-2xl shadow-2xl shadow-orange-500/30 transform hover:scale-105 transition-all duration-300 group"
                        >
                            <span className="text-lg">Discover All Trends</span>
                            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TrendingProducts;