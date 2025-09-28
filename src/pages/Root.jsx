import React from 'react';
import { Outlet } from 'react-router';
import { ToastContainer } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Root = () => {
    return (
        <div>
            <Navbar></Navbar>
            <ToastContainer position="top-right" />
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default Root;