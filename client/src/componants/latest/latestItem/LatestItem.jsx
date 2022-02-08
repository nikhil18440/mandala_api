import { FavoriteBorderOutlined, Favorite, StarBorderOutlined, Star, ShoppingCartOutlined, ShoppingCart } from '@material-ui/icons'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { addProduct } from '../../../redux/cartRedux'
import "./latestItem.css"

export default function LatestItem({latestItem}) {

    const [addedtoCart, setaddedtoCart] = useState(false)
    const [favourited, setfavourited] = useState(false)

    const cart = useSelector(state => state.cart)

    const handleAddtoCart = () => {
        setaddedtoCart(!addedtoCart)
        // addProduct({product})
    }

    
    useEffect(() => {
        if(cart.cart){
            cart.cart.products.map(item => {
                if(item._id == latestItem._id){
                    setaddedtoCart(true)
                }
            })
        }
    }, [])


    return (
        <div className='latestItem'>

            <div className="latestItemimgWrapper">
                <img src={latestItem.img[0]} alt="" className="latestItemImg" />
            </div>


            <div className="latestItemdetails">
                <div className="latestItemtop">
                    <div className="latestItemtitle"> {latestItem.title} </div>
                    <div className="latestItemprice">&#8377; {latestItem.price}</div>
                </div>
                <div className="latestItembottom">
                    <div className="latestItemleft">

                        <span onClick={handleAddtoCart}>
                            {
                                !addedtoCart ? (
                                    <ShoppingCartOutlined className='latestItemHeart'/>
                                ) : (
                                    <ShoppingCart className='latestItemHeart' htmlColor='rgb(0, 217, 255)'/>
                                )
                            }
                        </span>

                        {/* <span onClick={() => setfavourited(!favourited)}>
                            {
                                !favourited ? (
                                    <StarBorderOutlined className='latestItemStar'/>
                                ) : (
                                    <Star className='latestItemStar' htmlColor='gold'/>
                                )
                            }
                        </span> */}

                    </div>
                    <div className="latestItemright">
                        <Link to={`singleProduct/${latestItem._id}`} className="link">
                            <button className='latestItemBuyNowBtn'>Buy Now</button>
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    )
}
