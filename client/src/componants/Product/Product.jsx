import { FavoriteBorderOutlined, Favorite, StarBorderOutlined, Star, ShoppingCartOutlined, ShoppingCart } from '@material-ui/icons'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { instance } from '../../axiosInstance'
import { addProduct, delProduct,setCart } from '../../redux/cartRedux'
import "./product.css"

export default function Product({product,latest}) {

    const [liked, setliked] = useState(false)
    const [favourited, setfavourited] = useState(false)
    
    

    const dispatch = useDispatch()
    const cart = useSelector(state => state.cart)
    const user = useSelector(state => state.user)


    // const eachItem = (i) => {
    //     if(cart.products._id === i._id){
    //         console.log("duplicate")
    //     }else{
    //         dispatch(addProduct(i))
    //     }
    // }

    const changeDbCart = async () => {

        const cartId = JSON.parse(sessionStorage.getItem('cartId'))
        try {
            const res = await instance.put("https://mandala-api.vercel.app/api/cart/"+user.user._id, {
                _id: cartId._id,
                products: [...cart.cart.products,product],
                quantity: cart.cart.products.length,
                total: cart.total + product.price
            })
            console.log(res.data)
            dispatch(setCart(res.data))
            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const removefromDbCart = async () => {
        try {
            const cartId = JSON.parse(sessionStorage.getItem('cartId'))
            const newCart = cart.cart.products.filter(item => item._id !== product._id)
            console.log(newCart)
            const res = await instance.put("/cart/"+user.user._id, {
                _id: cartId._id,
                products: newCart,
                quantity: cart.cart.products.length,
                total: cart.total - product.price
            })
            dispatch(setCart(res.data))
            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddedtoCart = async () => {
        if(liked == false){    
            setliked(true)
            dispatch(addProduct(product))
            changeDbCart(product)
        }else if(liked == true){
            setliked(false)
            dispatch(delProduct(product._id))
            removefromDbCart(product)
        }
    }
    console.log(latest);

    useEffect(() => {
        console.log("cart: ",cart.cart)
        if(cart.cart){
            cart.cart.products.map(item => {
                if(item._id == product._id){
                    setliked(true)
                }
            })
        }
    }, [cart.cart])



    return (
        <div className='product'>

            <Link to={`/singleProduct/${product._id}`}>
                <div className="productimgWrapper">
                    <img src={product.img[0]} alt="" className="productImg" />
                </div>
            </Link>


            <div className="productdetails">
                <div className="producttop">
                    <div className="producttitle"> {product.title} </div>
                    <div className="productprice">&#8377; {product.price}</div>
                </div>
                <div className="productbottom">
                    <div className="productleft">

                        { user.user && (
                            <span onClick={user.user && handleAddedtoCart}>
                                {
                                    liked ? (
                                        <ShoppingCart className='productHeart' htmlColor='rgb(0, 217, 255)'/>
                                    ) : (
                                        <ShoppingCartOutlined className='productHeart'/>
                                    )
                                }
                            </span>
                        )}   

                        {/* <span onClick={() => setfavourited(!favourited)}>
                            {
                                !favourited ? (
                                    <StarBorderOutlined className='productStar'/>
                                ) : (
                                    <Star className='productStar' htmlColor='gold'/>
                                )
                            }
                        </span> */}

                    </div>
                    <div className="productright">
                        <Link to={`/singleProduct/${product._id}`} className='link'>
                            <button className='productBuyNowBtn'>Buy Now</button>
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    )
}
