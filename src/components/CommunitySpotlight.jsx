import React from 'react';
import { Link } from 'react-router';

const CommunitySpotlight = () => {
    const communityStats = [
        {
            icon: '🚀',
            number: '10K+',
            label: 'Active Developers',
            description: 'Building amazing projects together'
        },
        {
            icon: '💡',
            number: '5K+',
            label: 'Products Shared',
            description: 'Innovative tools and applications'
        },
        {
            icon: '⭐',
            number: '50K+',
            label: 'Total Upvotes',
            description: 'Community-driven recognition'
        },
        {
            icon: '🌍',
            number: '100+',
            label: 'Countries',
            description: 'Global tech community'
        }
    ];

    const featuredMembers = [
        {
            name: 'Sarah Chen',
            role: 'AI Engineer',
            avatar: '👩‍💻',
            achievement: 'Top Product Contributor',
            products: 12
        },
        {
            name: 'Alex Rodriguez',
            role: 'Full Stack Developer',
            avatar: '👨‍💻',
            achievement: 'Most Upvoted Products',
            products: 8
        },
        {
            name: 'Maya Patel',
            role: 'UI/UX Designer',
            avatar: '👩‍🎨',
            achievement: 'Design Excellence',
            products: 15
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-br from-purple-900 via-violet-800 to-purple-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-6 py-2 rounded-full text-sm font-semibold mb-4 border border-white/20">
                        <span>🌟</span>
                        <span>Community Spotlight</span>
                    </div>
                    <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                        Join Our Thriving Tech Community
                    </h2>
                    <p className="text-xl text-purple-200 max-w-3xl mx-auto">
                        Connect with developers, designers, and innovators from around the world. 
                        Share knowledge, collaborate on projects, and grow together.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {communityStats.map((stat, index) => (
                        <div 
                            key={index}
                            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                        >
                            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                                {stat.icon}
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                            <div className="font-semibold text-purple-200 mb-1">{stat.label}</div>
                            <div className="text-sm text-purple-300">{stat.description}</div>
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Featured Members */}
                    <div>
                        <h3 className="text-2xl font-bold mb-6 text-white">Featured Community Members</h3>
                        <div className="space-y-4">
                            {featuredMembers.map((member, index) => (
                                <div 
                                    key={index}
                                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="text-2xl bg-gradient-to-r from-purple-400 to-pink-400 rounded-full w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            {member.avatar}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-white">{member.name}</h4>
                                            <p className="text-purple-200 text-sm">{member.role}</p>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <span className="text-yellow-400 text-xs">🏆</span>
                                                <span className="text-xs text-purple-300">{member.achievement}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-white font-bold">{member.products}</div>
                                            <div className="text-xs text-purple-300">Products</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Community CTA */}
                    <div className="text-center lg:text-left">
                        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 shadow-2xl">
                            <h3 className="text-2xl font-bold mb-4 text-white">Ready to Join?</h3>
                            <p className="text-purple-100 mb-6">
                                Become part of the fastest-growing tech community. Share your projects, 
                                get feedback, and collaborate with like-minded innovators.
                            </p>
                            <div className="space-y-4">
                                <Link
                                    to="/register"
                                    className="inline-flex items-center justify-center w-full bg-white text-purple-600 hover:bg-purple-50 font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                                >
                                    <span>Join Community Now</span>
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                                <p className="text-purple-200 text-sm">
                                    Already a member?{' '}
                                    <Link to="/login" className="text-white font-semibold hover:underline">
                                        Sign in here
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CommunitySpotlight;