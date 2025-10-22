import React from "react";
import useAuthStore from "../store/auth.js";
import Home from "../pages/home/Home.jsx";
import Landing from "../pages/landing/LandingPage.jsx";

const HomeOrLanding = () => {

    const token = useAuthStore((state) => state.token);

    console.log("Token no HomeOrLanding:", token);
    return token ? <Home /> : <Landing />;
};

export default HomeOrLanding;
