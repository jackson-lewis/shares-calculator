/**
 * Footer
 */


// Core 
import React from "react"

// Styles
import Styles from '../../styles/base/footer.module.scss';


const Footer = () => (
    <footer className={ Styles.siteFooter }>
        <div className={ `container` }>
            <p><strong>&copy; { new Date().getFullYear() }</strong></p>
        </div>
    </footer>
)

export default Footer
