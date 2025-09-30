import React from 'react';
import Banner from '../components/Banner';
import FeaturedProducts from '../components/FeaturedProducts';
import TrendingProducts from '../components/TrendingProducts';
import CommunitySpotlight from '../components/CommunitySpotlight';
import InnovationHub from '../components/InnovationHub';
import Coupons from '../components/Coupons';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <FeaturedProducts></FeaturedProducts>
            <TrendingProducts></TrendingProducts>
            <CommunitySpotlight></CommunitySpotlight>
            <InnovationHub></InnovationHub>
            <Coupons></Coupons>
        </div>
    );
};

export default Home;