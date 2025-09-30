import React, { useState } from 'react';
import { Link } from 'react-router';

const InnovationHub = () => {
    const [activeCategory, setActiveCategory] = useState('all');

    const innovationCategories = [
        {
            id: 'ai',
            name: 'AI & Machine Learning',
            icon: '🤖',
            count: '1.2K',
            description: 'Cutting-edge AI tools and frameworks',
            color: 'from-purple-500 to-pink-500'
        },
        {
            id: 'web',
            name: 'Web Development',
            icon: '🌐',
            count: '2.3K',
            description: 'Modern web apps and frameworks',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            id: 'mobile',
            name: 'Mobile Apps',
            icon: '📱',
            count: '1.8K',
            description: 'iOS and Android applications',
            color: 'from-green-500 to-emerald-500'
        },
        {
            id: 'tools',
            name: 'Developer Tools',
            icon: '🛠️',
            count: '900',
            description: 'Productivity and workflow tools',
            color: 'from-orange-500 to-red-500'
        }
    ];

    const trendingTech = [
        {
            name: 'Generative AI',
            trend: 'Rising',
            change: '+45%',
            icon: '🎨',
            description: 'AI-powered content creation tools'
        },
        {
            name: 'Web3 & Blockchain',
            trend: 'Hot',
            change: '+32%',
            icon: '⛓️',
            description: 'Decentralized applications'
        },
        {
            name: 'Low-Code Platforms',
            trend: 'Growing',
            change: '+28%',
            icon: '🚀',
            description: 'Visual development tools'
        },
        {
            name: 'AR/VR Experiences',
            trend: 'Emerging',
            change: '+19%',
            icon: '👓',
            description: 'Immersive technology solutions'
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
                        <span>💡</span>
                        <span>Innovation Hub</span>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Explore Cutting-Edge Technology
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Discover the latest trends, tools, and technologies shaping the future of software development.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Technology Categories */}
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {innovationCategories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={`p-6 rounded-2xl text-left transition-all duration-300 transform hover:scale-105 ${
                                        activeCategory === category.id
                                            ? `bg-gradient-to-r ${category.color} text-white shadow-2xl`
                                            : 'bg-white text-gray-900 shadow-xl hover:shadow-2xl'
                                    }`}
                                >
                                    <div className="text-2xl mb-3">{category.icon}</div>
                                    <h4 className={`font-bold text-lg mb-2 ${
                                        activeCategory === category.id ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        {category.name}
                                    </h4>
                                    <p className={`text-sm mb-2 ${
                                        activeCategory === category.id ? 'text-white/90' : 'text-gray-600'
                                    }`}>
                                        {category.description}
                                    </p>
                                    <div className={`text-xs font-semibold ${
                                        activeCategory === category.id ? 'text-white/80' : 'text-gray-500'
                                    }`}>
                                        {category.count} products
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* View All Categories CTA */}
                        <div className="mt-6 text-center">
                            <Link
                                to="/products"
                                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300"
                            >
                                <span>View All Categories</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* Trending Technologies */}
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Trending Technologies</h3>
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <div className="space-y-4">
                                {trendingTech.map((tech, index) => (
                                    <div 
                                        key={index}
                                        className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-cyan-50 transition-all duration-300 group border border-gray-100 hover:border-blue-200"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="text-2xl bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl w-12 h-12 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                                                {tech.icon}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{tech.name}</h4>
                                                <p className="text-sm text-gray-600">{tech.description}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                                tech.trend === 'Hot' 
                                                    ? 'bg-red-100 text-red-800'
                                                    : tech.trend === 'Rising'
                                                    ? 'bg-orange-100 text-orange-800'
                                                    : tech.trend === 'Growing'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                <span>{tech.trend}</span>
                                            </div>
                                            <div className="text-sm font-bold text-green-600 mt-1">{tech.change}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Innovation Resources */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <h4 className="font-bold text-gray-900 mb-4">Innovation Resources</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <Link
                                        to="/community"
                                        className="p-3 bg-purple-50 hover:bg-purple-100 rounded-xl text-center transition-colors duration-300 group"
                                    >
                                        <div className="text-purple-600 text-lg mb-1">👥</div>
                                        <div className="text-sm font-semibold text-purple-700">Tech Talks</div>
                                    </Link>
                                    <Link
                                        to="/products?category=tools"
                                        className="p-3 bg-blue-50 hover:bg-blue-100 rounded-xl text-center transition-colors duration-300 group"
                                    >
                                        <div className="text-blue-600 text-lg mb-1">📚</div>
                                        <div className="text-sm font-semibold text-blue-700">Resources</div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-16 text-center">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl p-8 text-white shadow-2xl">
                        <h3 className="text-2xl font-bold mb-4">Ready to Showcase Your Innovation?</h3>
                        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                            Share your groundbreaking projects with the community and get the recognition you deserve.
                        </p>
                        <Link
                            to="/dashboard/add-product"
                            className="inline-flex items-center space-x-2 bg-white text-blue-600 hover:bg-blue-50 font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            <span>Submit Your Product</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InnovationHub;