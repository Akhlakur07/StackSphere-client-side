import React from 'react';
import { Outlet } from 'react-router';
import { ToastContainer } from 'react-toastify';
import Navbar from '../components/Navbar';

const Root = () => {
    return (
        <div>
            <Navbar></Navbar>
            <ToastContainer position="top-right" />
            <Outlet></Outlet>
        </div>
    );
};

export default Root;