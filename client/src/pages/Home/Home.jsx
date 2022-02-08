import React, { useEffect, useState } from 'react'
import Navbar from '../../componants/navbar/Navbar'
import blueImg from "../../assets/blue_pattern2.jpg"
import "./home.css"
import { ArrowForwardOutlined, Menu } from '@material-ui/icons'
import Latest from '../../componants/latest/Latest'
import Message from '../../componants/Message/Message'
import Footer from '../../componants/Footer/Footer'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { instance } from '../../axiosInstance'
import { setCart } from '../../redux/cartRedux'
import Product from '../../componants/Product/Product'
import axios from 'axios'

export default function Home() {

    // let newuser = JSON.parse(sessionStorage.getItem('user'))

    const [latestArray, setlatestArray] = useState([])
    console.log(process.env)
    console.log(process.env.REACT_APP_FIREBASE_APIKEY)



    useEffect(() => {
       
        const viewProduct = async () => {
            const res = await axios.get("/product?new=true")
            setlatestArray(res.data.filter(item => item.ordered === false ))
            console.log(res.data)
        }
        viewProduct()
    }, [])
    
    return (
        <div className='home'>
            <Navbar/>
            <div className="imgWrapper">
                <div className="shade"></div>
                <img className='mainImg' src={blueImg} alt="no img" />
                <div className="homeTitle">
                    <h2 className="header">Art Brings Harmony</h2>
                    <p className='desc'>the best Marketplace for Handrawn Mandala, Doodle and way more!</p>
                    <Link to="/products" className='link'>
                        <button className='Shopbtn'>
                            Shop Now
                            <ArrowForwardOutlined/>
                        </button>
                    </Link>
                </div>
            </div>
            <div className="title">Latest &nbsp; Artworks</div>
            <div className='homeProduct'>
                {
                    latestArray.length !== 0 ? (
                        latestArray.map(item => (
                            <Product product={item} latest={true} />
                        ))
                    ) : (
                        <div className='HomeComingsoonDiv'>
                            <h1>Coming soon...</h1>
                        </div>
                    )
                }
            </div>
            <Message/>
            <Footer/>
        </div>
    )
}
