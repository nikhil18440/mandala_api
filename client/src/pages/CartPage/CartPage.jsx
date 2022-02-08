import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { instance } from '../../axiosInstance'
import CartItem from '../../componants/cartItem/CartItem'
import Footer from '../../componants/Footer/Footer'
import Navbar from '../../componants/navbar/Navbar'
import Summary from '../../componants/Summary copy/Summary'
// import Summary from '../../componants/Summary/Summary'
import { setCartTotal } from '../../redux/cartRedux'
import "./cartPage.css"
import {loadStripe} from '@stripe/stripe-js'
import {Elements} from '@stripe/react-stripe-js'

export default function CartPage() {

    const [stripePromise,setstripePromise] = useState(null)
    
    const getStripe = () => {
        if(!stripePromise){
            setstripePromise(loadStripe(process.env.REACT_APP_STRIPE_KEY))
        }
        return stripePromise
    }  

    const user = useSelector(state => state.user)
    const cart = useSelector(state => state.cart) 
    // const [product, setproduct] = useState()
    const dispatch = useDispatch() 

    console.log(cart.total);
    
    const [cartItems, setcartItems] = useState([])
    const [totalPrice, settotalPrice] = useState(0)

    useEffect(() => {
        if(cart.cart){ 
            setcartItems(cart.cart)
        }else{
            setcartItems(null)
        }
    }, [])       

    
    return (
        <>
        <div className='cartPage'>
            
            <Navbar/>

            <div className="cartPageContainer1">
                {
                    cart.cart && (
                        cart.cart.products.length !== 0 ? (
                         <>
                            <div className="cartPageContainer2">
                            {
                                cart.cart ? (
                                    cart.cart.products.map(item => (
                                        <CartItem item={item}/>
                                    ))
                                ) : (
                                    <div></div>
                                )
                            }
                            </div>

                            <Elements stripe={getStripe()}>
                                <Summary totalPrice={totalPrice}/>
                            </Elements>
                                {/* <Summary totalPrice={totalPrice}/> */}
                            
                         </>
                         ) : (
                            <div className="displayNoItem">
                                <h1>No items in your cart yet!</h1>
                            </div>
                        )   
                    )    
                }
            </div>
            

        </div>
        <Footer/>
        </>
    )
}
