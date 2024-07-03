import { AddCircleOutline, ArrowForwardOutlined, CloudCircle, ShoppingBasketOutlined, ShoppingCart, ShoppingCartOutlined, Star, StarBorderOutlined } from '@material-ui/icons'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../../componants/navbar/Navbar'
import axios from 'axios'
import "./singleProduct.css"
import { useDispatch, useSelector } from 'react-redux'
import { instance } from '../../axiosInstance'
import { addProduct, delProduct, setCart } from '../../redux/cartRedux'

export default function SingleProduct() {

    const [liked, setliked] = useState(false)
    const [favourited, setfavourited] = useState(false)
    const [Img1, setImg1] = useState(false)
    const [Img2, setImg2] = useState(false)
    // const [quantityValue, setquantityValue] = useState(1)

    const [cartAdded, setcartAdded] = useState(false)
    const params = useParams()
    console.log(params)

    const user = useSelector(state => state.user)
    const cart = useSelector(state => state.cart)

    const dispatch = useDispatch()

    const [singleProductItem, setsingleProductItem] = useState(null)
    const [firstImg, setfirstImg] = useState(true)

    useEffect(() => {

        const viewSingleProduct = async () => {
            const res = await axios.get(`https://mandala-api.vercel.app/api/product/${params.id}`)
            setsingleProductItem(res.data)
            setImg1(res.data.img[0])
            setImg2(res.data.img[1])
            console.log(res.data)
        }
        viewSingleProduct()
        
    }, [])


    useEffect(() => {
        if(singleProductItem){
            if(cart.cart){
                cart.cart.products.map(item => {
                    if(singleProductItem._id == item._id){
                        setcartAdded(true)
                    }else{
                        setcartAdded(false)
                    }
                })
            }
        }
    },[singleProductItem])


    //adding to cart
    const changeDbCart = async () => {

        const cartId = JSON.parse(sessionStorage.getItem('cartId'))
        try {
            const res = await instance.put("/cart/"+user.user._id, {
                _id: cartId._id,
                products: [...cart.cart.products, singleProductItem],
                quantity: cart.cart.products.length,
                total: cart.total + singleProductItem.price
            })
            console.log(res.data)
            dispatch(setCart(res.data))
            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    //removing from cart
    const removefromDbCart = async () => {
        try {
            const cartId = JSON.parse(sessionStorage.getItem('cartId'))
            const newCart = cart.cart.products.filter(item => item._id !== singleProductItem._id)
            console.log(newCart)
            const res = await instance.put("/cart/"+user.user._id, {
                _id: cartId._id,
                products: newCart,
                quantity: cart.cart.products.length,
                total: cart.total - singleProductItem.price
            })
            dispatch(setCart(res.data))
            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    //handling cart adding
    const addingToCart = async () => {
        if(cartAdded == false){
            setcartAdded(true)
            dispatch(addProduct(singleProductItem))
            changeDbCart()
        }else if(cartAdded == true){
            setcartAdded(false)
            dispatch(delProduct(singleProductItem._id))
            removefromDbCart()
        }
    }


    return (
        <>
        <Navbar/>
        <div className='singleProduct'>
            
            <div className="singleProductLeft">
                <div className="singleProductLeftWrapper">
                    <img src={singleProductItem &&  (firstImg ? Img1 : (Img2 ? Img2 : "")) } alt="" className="singleProductleftImg" />
                    <div className="singleProductLeftBtns">
                        <input type="radio" className='radio1' name='radio1' checked={firstImg} onClick={() => setfirstImg(true)} />
                        <input type="radio" className='radio1' name='radio1' onClick={() => setfirstImg(false)} />
                    </div>
                </div>
            </div>

            <div className="line"></div>

            <div className="singleProductRight">
                <div className="singleProductRightWrapper">
                    {/* <span className='favouriteDiv' onClick={() => setfavourited(!favourited)}>
                        {
                            !favourited ? (
                                <StarBorderOutlined className='singleProductStar'/>
                            ) : (
                                <Star className='singleProductStar' htmlColor='gold'/>
                            )
                        }
                    </span> */}
                    <div className="singleProductRightTitle">{singleProductItem && singleProductItem.title}</div>
                    <div className="singleProductRightSize">Size: {singleProductItem && singleProductItem.size}</div>
                    {/* <div className="quantity">
                        Qty: <input className='quantityInput' type="number" min='1' onChange={(e) => setquantityValue(e.target.value)} />
                    </div> */}
                    <div className="singleProductRightPrice">Price: &#8377;{singleProductItem && singleProductItem.price}</div>

                    <div className="shippingdetails">free shipping</div>
                    <div className="replacementdetails">Replacement currently not available</div>
                    <div className="singleProductRightBtns">
                        <button className="singleProductRightaddToCart" onClick={addingToCart}>
                            {
                                cartAdded ? (
                                    <span>Added to Cart </span>
                                ) : (
                                    <span>Add to Cart </span>
                                )
                            } 
                            <ShoppingCartOutlined className='singleProductRightBtnsIcons'/>
                        </button>
                        <Link to="/cart" className='link'>
                            <button className="singleProductRightBuyNow">
                                <span>Go to Cart</span> <ArrowForwardOutlined className='singleProductRightBtnsIcons'/>
                            </button>
                        </Link>
                    </div>
                    {/* {
                        quantityValue == 0 && <div className="outofstockError">curently out of stock</div>
                    } */}
                </div>
            </div>

        </div>
        </>
    )
}




{/* <span onClick={() => setliked(!liked)}>
                            {
                                !liked ? (
                                    <ShoppingCartOutlined className='singleProductHeart'/>
                                ) : (
                                    <ShoppingCart className='singleProductHeart' htmlColor='rgb(0, 217, 255)'/>
                                )
                            }
                        </span>

                        <span onClick={() => setfavourited(!favourited)}>
                            {
                                !favourited ? (
                                    <StarBorderOutlined className='singleProductStar'/>
                                ) : (
                                    <Star className='singleProductStar' htmlColor='gold'/>
                                )
                            }
                        </span> */}