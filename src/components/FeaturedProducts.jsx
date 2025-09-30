import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const API_BASE = "http://localhost:3000";

const FeaturedProducts = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [upvoting, setUpvoting] = useState({});
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
            const response = await fetch(`${API_BASE}/products/featured`);
            if (response.ok) {
                const data = await response.json();
                setFeaturedProducts(data);
            } else {
                toast.error('Failed to load featured products');
            }
        } catch (error) {
            console.error('Error fetching featured products:', error);
            toast.error('Failed to load featured products');
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
                setFeaturedProducts(prev => 
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
            <section className="py-20 relative overflow-hidden bg-gradient-to-br from-purple-900 via-violet-800 to-purple-900">
                {/* Enhanced Animated Background */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Main Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-violet-600/15 to-purple-600/20"></div>
                    
                    {/* Animated Grid Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `
                                linear-gradient(to right, #8B5CF6 1px, transparent 1px),
                                linear-gradient(to bottom, #8B5CF6 1px, transparent 1px)
                            `,
                            backgroundSize: '50px 50px',
                            maskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black, transparent)'
                        }}></div>
                    </div>

                    {/* Floating Particles */}
                    <div className="absolute inset-0">
                        {[...Array(15)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-float"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 5}s`,
                                    animationDuration: `${15 + Math.random() * 10}s`
                                }}
                            ></div>
                        ))}
                    </div>

                    {/* Large Floating Orbs */}
                    <div className="absolute -top-60 -right-60 w-96 h-96 bg-gradient-to-br from-purple-500/30 to-pink-500/20 rounded-full blur-3xl animate-float-slow"></div>
                    <div className="absolute -bottom-60 -left-60 w-96 h-96 bg-gradient-to-br from-violet-500/30 to-blue-500/20 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '3s' }}></div>
                    <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-fuchsia-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <div className="animate-pulse inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-transparent px-6 py-2 rounded-full text-sm font-semibold mb-4 border border-white/20">
                            <span>⭐</span>
                            <span>Featured Collection</span>
                        </div>
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-white/40 to-white/20 bg-clip-text text-transparent mb-4">
                            Featured Products
                        </h2>
                        <div className="h-4 bg-white/20 rounded-full w-64 mx-auto mb-2 backdrop-blur-sm"></div>
                        <div className="h-4 bg-white/20 rounded-full w-48 mx-auto backdrop-blur-sm"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[...Array(4)].map((_, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 animate-pulse border border-white/10">
                                <div className="h-48 bg-white/20 rounded-2xl mb-4"></div>
                                <div className="h-6 bg-white/20 rounded mb-3"></div>
                                <div className="h-4 bg-white/20 rounded mb-4"></div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                                        <div className="h-3 bg-white/20 rounded w-16"></div>
                                    </div>
                                    <div className="w-16 h-8 bg-white/20 rounded-xl"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (featuredProducts.length === 0) {
        return (
            <section className="py-20 relative overflow-hidden bg-gradient-to-br from-purple-900 via-violet-800 to-purple-900">
                {/* Enhanced Background for Empty State */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-violet-600/15 to-purple-600/20"></div>
                    <div className="absolute -top-60 -right-60 w-96 h-96 bg-gradient-to-br from-purple-500/30 to-pink-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-60 -left-60 w-96 h-96 bg-gradient-to-br from-violet-500/30 to-blue-500/20 rounded-full blur-3xl"></div>
                </div>
                
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border border-white/20">
                        <div className="w-32 h-32 bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg border border-white/10">
                            <span className="text-6xl text-white/60">✨</span>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-4">No Featured Products Yet</h3>
                        <p className="text-white/60 text-lg mb-8 max-w-md mx-auto">
                            Our team is curating the most amazing products to feature here. Check back soon for inspiring innovations!
                        </p>
                        <Link
                            to="/products"
                            className="inline-flex items-center space-x-3 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl shadow-lg backdrop-blur-sm border border-white/20 transform hover:scale-105 transition-all duration-300"
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
        <section className="py-20 relative overflow-hidden bg-gradient-to-br from-purple-900 via-violet-800 to-purple-900">
            {/* Enhanced Eye-Catching Background */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Main Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-violet-600/15 to-purple-600/20"></div>
                
                {/* Animated Grid Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `
                            linear-gradient(to right, #8B5CF6 1px, transparent 1px),
                            linear-gradient(to bottom, #8B5CF6 1px, transparent 1px)
                        `,
                        backgroundSize: '50px 50px',
                        maskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black, transparent)'
                    }}></div>
                </div>

                {/* Floating Particles */}
                <div className="absolute inset-0">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 bg-white rounded-full opacity-30 animate-float"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${15 + Math.random() * 10}s`
                            }}
                        ></div>
                    ))}
                </div>

                {/* Large Floating Orbs with Enhanced Animation */}
                <div className="absolute -top-80 -right-80 w-96 h-96 bg-gradient-to-br from-purple-500/40 to-pink-500/30 rounded-full blur-3xl animate-float-slow"></div>
                <div className="absolute -bottom-80 -left-80 w-96 h-96 bg-gradient-to-br from-violet-500/40 to-blue-500/30 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '3s' }}></div>
                <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-gradient-to-br from-fuchsia-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-gradient-to-br from-indigo-500/25 to-violet-500/25 rounded-full blur-3xl animate-float" style={{ animationDelay: '6s' }}></div>

                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 animate-shimmer"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header - Enhanced for Dark Background */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-full text-sm font-bold mb-6 shadow-2xl border border-white/20 transform hover:scale-105 transition-transform duration-300 cursor-default">
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-sm">⭐</span>
                        </div>
                        <span>Editor's Choice</span>
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-sm">⭐</span>
                        </div>
                    </div>
                    <h2 className="text-5xl font-black text-white mb-6">
                        Featured <span className="bg-gradient-to-r from-purple-300 to-violet-300 bg-clip-text text-transparent">Innovations</span>
                    </h2>
                    <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                        Hand-picked by our team of experts. Discover the most groundbreaking products 
                        that are shaping the future of technology.
                    </p>
                </div>

                {/* Featured Products Grid - Enhanced for Dark Background */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {featuredProducts.map((product, index) => {
                        const canUpvote = user && user.email !== product.owner.email;
                        const isUpvoting = upvoting[product._id];

                        return (
                            <div 
                                key={product._id} 
                                className="group relative"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Card Container - Enhanced for Dark Background */}
                                <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20 hover:border-purple-400/50 transition-all duration-500 transform hover:-translate-y-2 relative">
                                    {/* Gradient Overlay on Hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-violet-500/0 group-hover:from-purple-500/10 group-hover:to-violet-500/10 transition-all duration-500 rounded-3xl"></div>
                                    
                                    {/* Glow Effect */}
                                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/0 to-violet-500/0 group-hover:from-purple-500/20 group-hover:to-violet-500/20 transition-all duration-500 blur-xl -z-10"></div>
                                    
                                    {/* Premium Featured Badge */}
                                    <div className="absolute top-4 left-4 z-20">
                                        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full text-xs font-bold shadow-2xl shadow-yellow-500/50 flex items-center space-x-1">
                                            <span className="text-sm">🏆</span>
                                            <span>Featured</span>
                                        </div>
                                    </div>

                                    {/* Product Image with Enhanced Styling */}
                                    <div className="relative overflow-hidden bg-gradient-to-br from-white/5 to-white/10">
                                        <div className="aspect-w-16 aspect-h-10 relative">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-52 object-contain p-6 group-hover:scale-110 transition-transform duration-700 ease-out"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=Innovation+Spotlight';
                                                }}
                                            />
                                            {/* Enhanced Shine Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                        </div>
                                    </div>

                                    {/* Product Content */}
                                    <div className="p-6 relative z-10">
                                        {/* Product Name */}
                                        <Link 
                                            to={`/product/${product._id}`}
                                            className="block mb-4 group-hover:text-purple-300 transition-colors duration-300"
                                        >
                                            <h3 className="text-lg font-bold text-white line-clamp-2 hover:text-purple-300 leading-tight">
                                                {product.name}
                                            </h3>
                                        </Link>

                                        {/* Enhanced Tags */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {product.tags?.slice(0, 3).map((tag, tagIndex) => (
                                                <span
                                                    key={tagIndex}
                                                    className="px-3 py-1 bg-white/10 text-purple-200 rounded-lg text-xs font-semibold border border-white/10 shadow-sm backdrop-blur-sm"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Enhanced Product Footer */}
                                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                            {/* Owner Info with Enhanced Styling */}
                                            <div className="flex items-center space-x-3">
                                                <div className="relative">
                                                    <img
                                                        src={product.owner.photo || "https://www.w3schools.com/w3images/avatar2.png"}
                                                        alt={product.owner.name}
                                                        className="w-8 h-8 rounded-full border-2 border-white/20 shadow-sm"
                                                    />
                                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white/20"></div>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-white">{product.owner.name}</p>
                                                    <p className="text-xs text-white/50">Creator</p>
                                                </div>
                                            </div>

                                            {/* Enhanced Upvote Button */}
                                            <button
                                                onClick={() => handleUpvote(product._id, product.owner.email)}
                                                disabled={isUpvoting || !canUpvote}
                                                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold transition-all duration-300 transform hover:scale-110 shadow-lg backdrop-blur-sm ${
                                                    canUpvote
                                                        ? 'bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white shadow-purple-500/50 border border-white/20'
                                                        : 'bg-white/10 text-white/40 cursor-not-allowed border border-white/10'
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
                                                        <span className="text-sm">{product.votes || 0}</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Corner Accents */}
                                    <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-tr-3xl"></div>
                                    <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-violet-500/20 to-transparent rounded-bl-3xl"></div>
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
                    <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
                        <h3 className="text-2xl font-bold text-white mb-4">
                            Ready to Discover More?
                        </h3>
                        <p className="text-white/70 mb-8 max-w-2xl mx-auto">
                            Explore thousands of innovative products, tools, and technologies shared by our global community of developers and creators.
                        </p>
                        <Link
                            to="/products"
                            className="inline-flex items-center space-x-4 px-10 py-5 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white font-bold rounded-2xl shadow-2xl shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 group border border-white/20"
                        >
                            <span className="text-lg">Explore All Innovations</span>
                            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    33% { transform: translateY(-20px) rotate(120deg); }
                    66% { transform: translateY(10px) rotate(240deg); }
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.6; }
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%) skewX(-12deg); }
                    100% { transform: translateX(200%) skewX(-12deg); }
                }
                .animate-float-slow {
                    animation: float-slow 20s ease-in-out infinite;
                }
                .animate-pulse-slow {
                    animation: pulse-slow 8s ease-in-out infinite;
                }
                .animate-shimmer {
                    animation: shimmer 8s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
};

export default FeaturedProducts;