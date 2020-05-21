/**
 * index.js
 * 
 * The 'home' page
 */

// Core
import React, { useState, useEffect } from "react";
import SEO from "../components/seo";

// Page components
import Layout from "../components/base/layout";


const Page = () => {
    
    return (
        <Layout>
            <SEO
                title={ `Home` }
            />
        </Layout>
    )
}

export default Page
