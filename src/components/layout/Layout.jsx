import React from "react";
import Header from "../shared/Header";
import Footer from "../layout/Footer";

const Layout = ({ children }) => {
    <>
        <Header />
        <main>{children}</main>
        <Footer />
    </>
}

export default Layout;