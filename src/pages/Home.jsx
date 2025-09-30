import React from 'react';
import Banner from '../components/Banner';
import FeaturedProducts from '../components/FeaturedProducts';
import TrendingProducts from '../components/TrendingProducts';
import CommunitySpotlight from '../components/CommunitySpotlight';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <FeaturedProducts></FeaturedProducts>
            <TrendingProducts></TrendingProducts>
            <CommunitySpotlight></CommunitySpotlight>
        </div>
    );
};

export default Home;