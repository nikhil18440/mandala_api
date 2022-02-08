import React, { useState } from 'react'
import {AccountCircleOutlined, Menu, Person, PersonOutline, PersonOutlineRounded, ShoppingCartOutlined} from "@material-ui/icons"
import "./navbar.css"
import { Link } from 'react-router-dom'
import noAvatar from "../../assets/no_avatar.jpg"
import { Badge } from '@material-ui/core'
import { useSelector } from 'react-redux'

export default function Navbar() {

    const cart = useSelector(state => state.cart)
    const user = useSelector(state => state.user)

    const [toggled, settoggled] = useState(false)

    const handleLogout = () => {
        sessionStorage.clear()
        sessionStorage.clear()
        window.location.reload()
    }

    return (
        <div className='navbar'>
            
            <div className="left">
                <Link className='link' to="/"><h1 className='leftTitle'>MANDALA</h1></Link>
            </div>

            <div className="center">
                <ul className='centerList'>
                    <Link to="/" className="centerListItem link"> <li>Home</li> </Link>
                    <Link to="/products/" className="centerListItem link"> <li>Products</li> </Link>
                    { user.user && <Link to={`/order/${user.user._id}`} className="centerListItem link"> <li>MyOrders</li> </Link> }
                </ul>
            </div>

            {
                user.user !== null ? (
                    <div className="right">
                        <button className="navbarSignIn logoutBtnTopNavbar"onClick={handleLogout}>LOGOUT</button>
                        <div className="rightIcons">
                            <Link to="/cart"> 
                                <Badge badgeContent={cart.quantity} color='primary'>
                                    <ShoppingCartOutlined className='cart'/> 
                                </Badge>
                            </Link>
                            <Link to={`/profile`}> 
                                {/* <AccountCircleOutlined className='avatar'/>  */}
                                <img src={user.user.profilePic ? user.user.profilePic : noAvatar} alt="" className="avatar" />
                            </Link>
                        </div>
                    </div>
                ) : (
                    <Link to="/login" className="link">
                         <button className="navbarSignIn">SIGN IN</button>
                    </Link>
                )
            }

            {
                <div className="NavbartoggleContainer">
                    <div className="toggleBtn" onClick={() => settoggled(!toggled)}> <Menu/> </div>
                    {
                        toggled && (
                            <div className="navItems">
                                <ul>
                                    <Link to="/" className='link'> <li className='homeNavitem'>Home</li> </Link>
                                    <Link to="/products" className='link'> <li  className='homeNavitem'>Poducts</li> </Link>
                                    {
                                        user.user && (
                                            <Link to="/order/undefined" className='link'> <li  className='homeNavitem'>My Orders</li> </Link>
                                        )
                                    }
                                    <Link to="/" className='link' onClick={handleLogout}> <li  className='logoutBtn'>Logout</li> </Link>
                                </ul>
                            </div>
                        )
                    }
                </div>
            }
            
        </div>
    )
}
