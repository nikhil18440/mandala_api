import { CheckCircleOutlined } from '@material-ui/icons';
import axios from 'axios';
import React, {useEffect} from 'react';
import { useState } from 'react';
import { instance } from '../../axiosInstance';
import "./orderItem.css"

export default function OrderItem({orderItem}) {

    const [orderSingleItem,setorderSingleItem] = useState()

    useEffect(() => {

        const findOrderItem = async () => {

            try {
                const res = await axios.get("https://mandala-api.vercel.app/api/product/" + orderItem.productId)
                if(res.data){
                    setorderSingleItem(res.data)
                }
                console.log(res.data);
            } catch (error) {
                console.log(error);
            }

        }
        findOrderItem()

    }, [orderItem])

  return (
      <div className='orderItem'>

        {
            orderSingleItem && (
                <div className="orderItemContainer">
                    <div className="orderItemLeft">
                        <img className="orderItemLeftImg" src={orderSingleItem.img[0]} alt="no img" />
                    </div>

                    <div className="orderItemRight">
                        <div className="orderItemRightTitle">{orderSingleItem.title}</div>
                        <div className="orderRightItemBottom">
                            <div className="orderItemRightPrice">price: &#8377;{orderSingleItem.price}</div>
                            <div className="orderItemRightStatus">status: 
                                <div className='orderItemRightStatusValueContainer' style={orderItem.status === "pending" ? {color:'orangered'} : {color:'green'}}>
                                    <span className='orderItemRightStatusValue'>{orderItem.status}</span>
                                    {orderItem.status !== "pending" && <CheckCircleOutlined className='orderItemRightStatusIcon'/> }
                                </div>
                            </div>
                                <p className='orderItemRightPara'>{orderItem.status === "pending" && 'will reach within 10 days'}</p>
                        </div>
                    </div>
                </div>
            ) 
        }

      </div>
    )
}
