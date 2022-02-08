import React from 'react'
import {useSelector} from 'react-redux'
import { Link } from 'react-router-dom'
import "./navbarSm.css"

export default function NavbarSm() {

    const user = useSelector(state => state.user)

    return (
        <div className='navbarSm'>
            <div className="navbarSmcenter">
                <ul className='navbarSmcenterList'>
                    <Link to="/" className="navbarSmcenterListItem link"> <li>Home</li> </Link>
                    <Link to="/products" className="navbarSmcenterListItem link"> <li>Products</li> </Link>
                    { user.user && <Link to={`/order/${user.user._id}`} className="navbarSmcenterListItem link"> <li>MyOrders</li> </Link> }
                </ul>
            </div>
        </div>
    )
}
