import React from "react";
import './DefaultLayout.css';

import Header from './header/Header';
import Footer from './footer/Footer';


const DefaultLayout = ({ children }) => {

    return (
        <div className="main-container">
            <Header />
            <div className="content">
                {children}
            </div>
            <Footer />
        </div>
    );
}; export default DefaultLayout;