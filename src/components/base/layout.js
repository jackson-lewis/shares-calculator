/**
 * Layout
 * 
 * The layout component is at the core of bringing
 * together the overall layout of the page.
 */

 // Core
import React from "react"
import PropTypes from "prop-types"

// Core components
// import Header from "./header"
// import Footer from "./footer"


const Layout = ({ children }) => {

    return (
        <>
            <main className={ 'site-main' }>{children}</main>
        </>
    )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
