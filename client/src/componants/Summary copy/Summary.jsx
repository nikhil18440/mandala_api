import React, {useState,useEffect,useTimeout} from 'react'
import "./summary.css"
import StripeCheckout from 'react-stripe-checkout'
import { useSelector } from 'react-redux'
import {instance} from '../../axiosInstance'
import { Link } from 'react-router-dom'
import bson from 'bson'
import axios from 'axios'
import { CircularProgress } from '@material-ui/core'
import {useStripe,useElements,CardElement, CardExpiryElement, CardNumberElement, CardCvcElement} from '@stripe/react-stripe-js'
import { Close } from '@material-ui/icons'
import Modal from 'react-modal'

export default function Summary({totalPrice}) {

    const user = useSelector(state => state.user)
    const cart = useSelector(state => state.cart)
    
    const [stripeToken, setstripeToken] = useState(null)
    const [StripeStatus, setStripeStatus] = useState(null)
    const [Loaded, setLoaded] = useState(true)
    const [clientSecret, setclientSecret] = useState()
    const [disabled, setdisabled] = useState()
    const [processing, setprocessing] = useState()
    const [error, seterror] = useState()
    const [success, setsuccess] = useState()
    const [isOpen, setisOpen] = useState()
    
    
    
    const stripe = useStripe();
    const elements = useElements();

    
    const fetchPaymentIntent = async () => {
        setisOpen(true)
        try{
            const res = await axios.post("https://mandala-api.vercel.app/api/checkout/payment", {
                amount: JSON.stringify(cart.total * 100)
            })
            setclientSecret(res.data.clientSecret)
            console.log(res.data.clientSecret)
        }catch(err){
            console.log(err)
        }
    }
        
    

    const handleChange = async (e) => {
        setdisabled(e.empty)
        seterror(e.error ? e.error.message : "")
    }

    console.log(disabled, error);

    const handleSubmit = async (e) => {
        e.preventDefault()
        setprocessing(true)

        const res = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement),
            billing_details: {
                name: user.user.username,
                email: user.user.email,
                address: {
                    country: user.user.country==='India' ? 'IN' : null,
                    state: user.user.state,
                    line1: user.user.address,
                    postal_code: user.user.pincode
                }
            },
        }).then(async (res) => {
            console.log(res.paymentMethod);

            if(res.paymentMethod && res.paymentMethod.id){

                const payload = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: res.paymentMethod.id
                })
                if(payload && (payload.paymentIntent.status === "succeeded")){
                    setprocessing(false)
                    setsuccess(true)
                    seterror(false)
                    makeRequest()
                }else{
                    setprocessing(false)
                    setsuccess(false)
                    seterror(true)
                }
                console.log(payload)
            }else{
                seterror(true)
            }


        }).catch((error) => {
            seterror(true)
            console.log(error);
        })

    }


    const makeRequest = async () => {
        try {
            const userOrder = JSON.parse(sessionStorage.getItem('order'))
            console.log(userOrder);

            if(userOrder){
                const updatingCart = async (item) => {
                    const order = await instance.put("https://mandala-api.vercel.app/api/order/"+user.user._id, {
                        orderId: userOrder[0]._id || userOrder._id,
                        productId: item._id,          
                        })
                        console.log(order.data);

                        if(order.data){

                            const orderedData = await instance.put("https://mandala-api.vercel.app/api/product/ordered/"+user.user._id, {
                                products: cart.cart.products
                            })

                            if(orderedData.data){

                                const cartRemoval = await instance.put("https://mandala-api.vercel.app/api/cart/"+user.user._id, {
                                    _id: cart.cart._id,
                                    products: [],
                                    quantity: 0,
                                    total: 0
                                })

                                console.log(orderedData.data);
                                if(cartRemoval.data){
                                    window.location.replace("https://mandala-api.vercel.app/api/order/"+user.user._id)
                                }
                            }
                        }
                    }
                cart.cart.products.map(item => {
                    updatingCart(item)
                })
            
            
            }

        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {

    })

    // let cartItems = cart.cart.products.map(item => {
    //     return item._id})
    // console.log(cartItems)

    const CardElementOptions = {
        hidePostalCode: true,
        style: {
            base: {
                fontSize: '18px'
            }
        }
    }

    // const closeModal = () => {
    //     setisOpen(true)
    // }
    const closeModal = () => {
        setisOpen(false)
    }

    return (
        <div className='summaryFlexBox'>
        <div className='summary'>
            
            <div className="summaryTitle">Order Summary</div>

            <div className="subtotal">
                <span className='summarySubHeads'>subtotal:</span>
                <span>&#8377;{cart.total}</span>
            </div>

            <div className="shippingFee">
                <span className='summarySubHeads'>shipping fee:</span>
                <span>0</span>
            </div>

            <div className='summaryline'></div>

            <div className="grandTotal">
                <span className='summarySubHeads'>Total:</span>
                <span>&#8377;{cart.total}</span>
            </div>

            {/* <CardElement/> */}
            
                    
            {
                (user.user.address && user.user.pincode && user.user.country && user.user.state) ? (
                    <button className='summaryBuyNowButton' onClick={() => fetchPaymentIntent()}>
                        Buy Now
                    </button>
                ) : (
                    <>
                        <h4 className='summaryGoToProfileDesc'>complete your profile to continue</h4>
                        <Link to="/profile">
                            <button className='summaryGoToProfileBtn'>
                                Profile
                            </button>
                        </Link>
                    </>
                )          
            }

            <Modal 
                isOpen={isOpen} 
                onRequestClose={closeModal}    
                ariaHideApp={false}
                className='summaryModal'
            >
                <div className="summaryModalTop">
                    <h2 className="summaryModalTopHeading">Manadala</h2>
                    <Close className="summaryModalTopClose" onClick={() => setisOpen(false)} />
                </div>
                <form onSubmit={handleSubmit} style={{width:'100%'}}>
                    <div className="summaryModalEmail">{user.user.email}</div>
                    <div>
                        <CardElement options={CardElementOptions} onChange={handleChange} />
                        {/* <CardNumberElement options={CardElementOptions} onChange={handleChange} />
                        <div className='summaryModalexpCVC'>
                            <span><CardExpiryElement options={CardElementOptions} onChange={handleChange}/></span>
                            <span><CardCvcElement options={CardElementOptions} onChange={handleChange}/></span>
                        </div> */}
                    </div>
                    <div className="summaryModalAmount">
                        <span>Amount: </span>
                        <span>&#8377;{cart.total}</span>
                    </div>
                    {/* style={(!disabled && !error && success) ? {backgroundColor:'green', border: '1px solid rgb(0, 80, 0)'} : {backgroundColor:'red',border: '1px solid rgb(189, 0, 0)'}} */}
                    <button style={success ? {backgroundColor: 'green', border: '1px solid darkgreen'} : {backgroundColor: 'red', border: '1px solid darkred'}} className='summaryModalPayBtn' type="submit" disabled={!stripe || !elements || error || processing || disabled || success}>
                        {
                            processing ? <CircularProgress color='white' size='15px' /> : 'Pay'
                        }
                    </button>
                </form>
            </Modal>
            

            {
                isOpen && (
                    <>
                    
                    {/* <div className="SummaryModal">
                        <Close onClick={() => setisOpen(false)} />
                        <form onSubmit={handleSubmit} style={{width:'100%'}}>
                            <div>
                                <CardElement options={CardElementOptions} onChange={handleChange} />
                            </div>
                            <button type="submit" disabled={!stripe || !elements || error || processing || disabled}>
                                Pay
                            </button>
                        </form>
                    </div> */}
                    </>
                )
            }

            
        </div>        
        <div className="summaryAddressContainer">
            <div className="summaryAddressContainerTitle">Address</div>
            <div className="summaryAddressContainerAddress">
                {user.user.address}
            </div>
        </div>
        </div>
    )
}
