import React, { useEffect, useState } from 'react'
import Footer from '../../componants/Footer/Footer'
import LatestItem from '../../componants/latest/latestItem/LatestItem'
import Navbar from '../../componants/navbar/Navbar'
import Product from '../../componants/Product/Product'
import "./products.css"
import axios from 'axios'
import {instance} from '../../axiosInstance'
import { useSelector } from 'react-redux'



export default function Products() {

    const [productArray, setproductArray] = useState([])
    const user = useSelector(state => state.user)

    useEffect(() => {
       
        const viewProduct = async () => {
            const res = await axios.get("https://mandala-api.vercel.app/api/product/")
            
            setproductArray(res.data.filter(item => item.ordered === false ))
            console.log(res.data)
            
        }
        viewProduct()
    }, [])

    return (
        <div className='products'>
            <Navbar/>
            
            {
                productArray.length !== 0 ? (
                    <div className="productItems">
                        {
                            productArray.map((item) => (
                                <Product product={item} latest={false} />
                            ))
                        }          
                    </div>
                ) : (
                    <div className='productsComingsoonDiv'>
                        <h1>Coming soon...</h1>
                    </div>
                )
            }
            <Footer/>
        </div>
    )
}
