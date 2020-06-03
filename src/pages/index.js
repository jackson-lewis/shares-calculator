/**
 * The App, this is an SPA
 * 
 * Here is a list of things that would improve the experience and/or functionality of the app:
 * @todo Support for commission fees. User would need to be able to set the fees cost. Bonus: save previous value to localStorage.
 * @todo Allow number of shares sold to differ from shares bought. A conditional would be required to prevent shares sold to be greater than shares bought.
 * @todo Just a thought. Put extraDetails value in localStorage, as some users may always prefer the details to be shown.
 */

// Core
import React, { useState, useEffect } from "react";
import SEO from "../components/seo";

// Page components
import Layout from "../components/base/layout";

// Styles
import Styles from '../styles/main.module.scss'


// Our main component
const Page = () => {

    /**
     * States
     */

    // We store buyPrice, sellPrice, buyShares and sellShares 
    // as empty strings so their initial field value is empty.
    // Placeholders are used to represent an example

    // Store as raw values, so a 225p price would be 225
    const [ buyPrice, setBuyPrice ] = useState( `` )
    const [ sellPrice, setSellPrice ] = useState( `` )

    // Store as unitless values
    const [ buyShares, setBuyShares ] = useState( `` )
    const [ sellShares, setSellShares ] = useState( `` )

    // Tells the app whether or not the sell shares has been manually set
    const [ hasSetSellShares, setHasSetSellShares ] = useState( false )

    // bool
    const [ incStampDuty, willIncStampDuty ] = useState( false )

    // Store as pounds
    const [ stampDuty, setStampDuty ] = useState( 0 )

    // Store as pounds
    const [ buyTotal, setBuyTotal ] = useState( 0 )
    const [ sellTotal, setSellTotal ] = useState( 0 )

    // Store as pounds
    const [ returnValue, setReturnValue ] = useState( 0 )

    // Store as percent (exc. % sign)
    const [ returnPercent, setReturnPercent ] = useState( 0 )

    // Should extra details be shown
    const [ extraDetails, setExtraDetails ] = useState( false )


    /**
     * Utility function to convert a value from pence to pounds
     * 
     * @param {int} value The value to convert to pounds
     * 
     * @return {int} The value converted to pounds
     */
    const toPounds = value => value > 0 ? parseFloat( value / 100 ) : false


    /**
     * Utility to take a value and convert to integar and force 
     * 2 decimal points.
     * 
     * @param {str|int} value The value to properly format
     * 
     * @return {int} The value as a shiny integar with two decimal spaces
     */
    const formatCurrency = value => parseFloat( value ).toFixed( 2 )


    /**
     * The main function to update the return values from user input.
     * 
     * There is no 'submit', so values are updated on input change
     * 
     * @param {object} e The event from input
     * @todo Auto space the price and shares values accordingly for easy reading
     */
    const handleCalcChange = e => {

        const target = e.target

        // This prevents anything weird happening during the calculations
        const value = target.value === `` ? `` : parseFloat( target.value )

        switch ( target.name ) {
            case `buy_price`:
                setBuyPrice( value )
                break;

            case `buy_shares`:
                setBuyShares( value )

                // For as long as the sell_shares input isn't changed by the user, 
                // update sellShares with buyShares value
                if ( ! hasSetSellShares ) {
                    setSellShares( value )
                }
                
                break;

            case `sell_price`:
                setSellPrice( value )
                break;

            case `sell_shares`:
                // Makes sure the user can't sell more shares than they've bought
                setSellShares( value > buyShares ? buyShares : value )

                setHasSetSellShares( true )
                break;    

            case `inc_tax`:
                willIncStampDuty( target.checked )
                break;

            default:
                return false
        }
    }


    /**
     * Reset the prices and shares, all totals and return values
     * will be recalculated to zero.
     */
    const reset = () => {
        setBuyPrice( `` )
        setSellPrice( `` )
        setBuyShares( `` )
        setSellShares( `` )
    }


    /**
     * Update all totals and return values when each field value state is changed
     * 
     * Almost all states are needed as dependancies here (returnPercent as exception),
     * as it's the only value that isn't needed for other calculations
     */
    useEffect( () => {

        /**
         * Get the subtotal of an order. The reason this is marked as the subtotal
         * and not the actual total is because the returned value is before an fees
         * such as stamp duty has been applied. Any such fees should be manually applied
         * wherever it is necessary.
         * 
         * @param {int} price The price of the share
         * @param {int} shares The number of shares in the order
         * 
         * @return {int} The value of the order (exc. any fees)
         */
        const getOrderSubTotal = ( price, shares ) => formatCurrency( toPounds( price ) * shares )


        // Dead simple, just needs that conditional on the return that sets
        // whether the stamp duty is to be included or not
        setBuyTotal( () => {
            const total = getOrderSubTotal( buyPrice, buyShares )

            // Conditional to decide if buyTotal should include stamp duty  
            return incStampDuty ? ( parseFloat( total ) + parseFloat( stampDuty ) ).toFixed( 2 ) : total
        })

        // Not much needed to calculate sellTotal, just the price and number of shares
        setSellTotal( getOrderSubTotal( sellPrice, sellShares ) )

        // The stamp duty value is 0.5% of the total buyTotal
        setStampDuty( formatCurrency( ( toPounds( buyPrice ) * buyShares * 0.005 ) ) )
        
        // Super easy value to calculate, hence being a one-liner
        setReturnValue( () => {
            if ( sellPrice === `` ) return 0

            return formatCurrency( sellTotal - ( buyTotal / ( buyShares / sellShares ) ) )
        } )

        // Calculating the return percentage takes a little more work
        setReturnPercent( () => {

            // We need this to prevent the state value from being NaN
            // when returnValue or buyTotal are zero
            if ( buyTotal === `0.00` ) return 0

            // Multiplying by 100 converts the value to a percentage
            return formatCurrency( ( ( sellPrice - ( incStampDuty ? buyPrice * 1.005 : buyPrice ) ) / buyPrice ) * 100 )
        })

    }, [ buyPrice, buyShares, sellPrice, sellShares, incStampDuty, stampDuty, buyTotal, sellTotal, returnValue ] )

    
    return (
        <Layout>
            <SEO
                title={ `Shares Return Calculator` }
            />
            <div className={ Styles.wrapper }>
                <form className={ Styles.form }>
                    <div className={ Styles.formRow }>
                        <div className={ Styles.field }>
                            <label htmlFor="buy_price">Buy price</label>
                            <input type="number" name="buy_price" id="buy_price" placeholder="150" autoComplete="off" value={ buyPrice } onChange={ handleCalcChange } />
                        </div>
                        <div className={ Styles.field }>
                            <label htmlFor="buy_shares">Shares</label>
                            <input type="text" pattern="[0-9]*" name="buy_shares" id="buy_shares" placeholder="500" autoComplete="off" value={ buyShares } onChange={ handleCalcChange } />
                        </div>
                    </div>
                    <div className={ Styles.formRow }>
                        <div className={ Styles.field }>
                            <label htmlFor="sell_price">Sell price</label>
                            <input type="number" name="sell_price" id="sell_price" placeholder="200" autoComplete="off" step="0.01" value={ sellPrice } onChange={ handleCalcChange } />
                        </div>
                        
                        <div className={ Styles.field }>
                            <label htmlFor="sell_shares">Shares</label>
                            <input type="text" pattern="[0-9]*" name="sell_shares" id="sell_shares" placeholder="500" autoComplete="off" value={ sellShares } onChange={ handleCalcChange } />
                        </div>
                    </div>
                    
                    <div className={ [ Styles.formRow, Styles.fieldCheckbox ].join( ` ` ) }>
                        <input type="checkbox" name="inc_tax" id="inc_tax" checked={ incStampDuty } onChange={ handleCalcChange } />
                        <label htmlFor="inc_tax">Include stamp duty?</label>
                    </div>

                    <div className={ Styles.formRow }>
                        <button type="button" className={ Styles.button } onClick={ () => setExtraDetails( extraDetails ? false : true ) }>{ extraDetails ? `Hide` : `Show` } details</button>
                        <button type="button" className={ Styles.button } onClick={ () => reset() }>Reset</button>
                    </div>
                </form>
                <table className={ Styles.returnTable }>
                    { extraDetails &&
                    <thead>
                        <tr>
                            <td>Buy</td>
                            <td>&pound;{ buyTotal }</td>
                        </tr>
                        <tr>
                            <td>Sell</td>
                            <td>&pound;{ sellTotal }</td>
                        </tr>
                    </thead> }
                    <tbody>
                        { incStampDuty &&
                        <tr>
                            <td>Stamp duty</td>
                            <td>&pound;{ stampDuty }</td>
                        </tr> }
                        <tr>
                            <td>Return</td>
                            <td>&pound;{ returnValue }</td>
                        </tr>
                        <tr>
                            <td>Return (%)</td>
                            <td>{ returnPercent }%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Layout>
    )
}

export default Page
