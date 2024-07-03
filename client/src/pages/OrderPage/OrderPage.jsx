import React from 'react';
import './orderPage.css'
import Navbar from "../../componants/navbar/Navbar"
import Footer from "../../componants/Footer/Footer"
import { useEffect } from 'react';
import {instance} from '../../axiosInstance'
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useState } from 'react';
import OrderItem from '../../componants/orderItem/OrderItem';

export default function OrderPage() {

  const [orderItems,setorderItems] = useState(null)
  const user = useSelector(state => state.user)

  useEffect(() => {

    const findOrders = async () => {
      try {
      
        const res = await instance.get("https://mandala-api.vercel.app/api/order/" + user.user._id)

        if(res.data === null || res.data.length === 0){
          const order = await instance.post("https://mandala-api.vercel.app/api/order/" + user.user._id, {
            userId: user.user._id,
            products: [],
            amount: 0,
            address: user.user.address || "",
          })
          setorderItems(order.data[0].products)
        }else if(res.data){
          setorderItems(res.data[0].products)
          console.log(res.data[0].products);
        }

      } catch (error) {
        console.log(error);
      }
    }
    if(user.user){
      findOrders()
    }

  },[])

  return (
  
    <div className='orderPage'>
        
        <Navbar/>

        
          
          <div className="orderPageContainer">
          {
            orderItems && orderItems.length!==0 ? ( 
              orderItems.map(item => (
                <OrderItem orderItem={item} />
              ))
            ) : (
              <div className="displayNoItemOrder">
                No orders yet...Order now!
              </div>
            )
          }
        </div>
        

        <Footer/>

    </div>
  
  );
}
