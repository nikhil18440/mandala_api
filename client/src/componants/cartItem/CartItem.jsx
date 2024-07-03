import React, { useEffect, useState } from 'react';
import { Delete } from '@material-ui/icons'
import { useDispatch, useSelector } from 'react-redux';
import { instance } from '../../axiosInstance';
import { delProduct, setCart } from '../../redux/cartRedux';
import axios from 'axios';
import "./cartItem.css"

export default function CartItem({item}) {

    
    const user = useSelector(state => state.user)
    const cart = useSelector(state => state.cart)
    const dispatch = useDispatch()

    const [singleCartItem, setsingleCartItem] = useState()
    
    useEffect(() => {
        if(item){
            const findCartItem = async () => {
                try {
                    const res = await axios.get("https://mandala-api.vercel.app/api/product/" + item._id)
                    if(res.data.ordered === false){
                        setsingleCartItem(res.data)
                    }
                    console.log(res.data)
                } catch (error) {
                    console.log(error)
                }
            }
            findCartItem()
        }
        // console.log(item)
    },[item, cart.cart])

    const handleRemoveItem = async () => {
        try {
            const cartId = JSON.parse(sessionStorage.getItem('cartId'))
            const newCart = cart.cart.products.filter(i => i._id !== singleCartItem._id)
            console.log(newCart)
            const res = await instance.put("https://mandala-api.vercel.app/api/cart/"+user.user._id, {
                _id: cartId._id,
                products: newCart,
                quantity: cart.cart.products.length,
                total: cart.total - singleCartItem.price
            })
            dispatch(setCart(res.data))
            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
    }

  return (
      <>
    {
        singleCartItem && (
            <div className='cartItem'>
                <div className="cartPageContainer3">
                    <div className="cartPageimgWrapper">
                        <img src={singleCartItem.img[0]} alt="" className="cartPageImg" />
                    </div>
                    <div className="cartPageDetails">
                        <div className="cartPageTitle">{singleCartItem.title}</div>
                        <div className="cartPageOtherDetails">
                            <div className="cartPageSize">size: {singleCartItem.size}</div>
                            <div className="cartPagePrice">price: &#8377;{singleCartItem.price}</div>
                        </div>
                        <div className="cartPageDltBtnContainer" onClick={handleRemoveItem}>
                            <span>Remove from Cart</span>
                            <Delete className="cartPageDltBtn"/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    </>
  )
}
