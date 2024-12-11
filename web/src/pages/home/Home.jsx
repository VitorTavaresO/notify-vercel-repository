import React from "react";
import { Helmet } from 'react-helmet';

import './Home.css';

const Home = () => {

    return (
        <div className="home-container">
            <Helmet>
                <title>Início</title>
            </Helmet>
            <div className="cover-container"></div>
        </div>
    );
}; export default Home;