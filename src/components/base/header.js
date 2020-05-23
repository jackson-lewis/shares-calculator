/**
 * Header
 */


// Main
import { Link } from "gatsby"
import React from "react"

// Styles
import Styles from '../../styles/base/header.module.scss';


const Header = () => (
    <header className={ Styles.siteHeader }>
        <div className={ Styles.container }>
            <Link to={ `/` } className={ Styles.logo } aria-label={ 'Home' }>
                Shares Calculator
            </Link>
        </div>
    </header>
)

export default Header
