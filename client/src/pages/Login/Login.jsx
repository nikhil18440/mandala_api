import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { userFetchFailure, userFetchStart, userFetchSuccess } from '../../redux/userReducer'
import axios from 'axios'
import "./login.css"
import Navbar from "../../componants/navbar/Navbar"
import NavbarSm from '../../componants/navbarSm/NavbarSm'

export default function Login() {

    // const [error, seterror] = useState(false)
    const [email, setemail] = useState()
    const [password, setpassword] = useState()

    const user = useSelector(state => state.user)

    const dispatch = useDispatch()


    //on login
    const handleLoginSubmit = async (e) => {
        e.preventDefault()
        
        let currUser = {
            email: email,
            password: password
        }
        
        dispatch(userFetchStart())
        
        try {
            const res = await axios.post("/auth/login", currUser)
            if(res){
                dispatch(userFetchSuccess(res.data))
                sessionStorage.setItem('user', JSON.stringify(res.data))
                sessionStorage.setItem('token', JSON.stringify(res.data.accesstoken))
                window.location.replace("/")
            }
        } catch (error) {
            dispatch(userFetchFailure())
        }
        
    }

    return (
        <>
        <NavbarSm/>
        <div className='login'>
            
            <div className="loginWrapper">

                <h1 className="loginTitle">MANDALA</h1>

                <div className="loginSubTitle">login</div>
                <form className="loginForm" onSubmit={handleLoginSubmit}>
                    <input type="email" className="loginemail" required placeholder='email' onChange={(e) => setemail(e.target.value)}/>
                    <input type="password" className="loginpassword" min={3} required placeholder='password' onChange={(e) => setpassword(e.target.value)}/>
                    { user.error && <h4 className="loginerror">Wrong Username or Password</h4>}
                    
                    <button className="loginBtn" type='submit'>LOGIN</button>
                    
                </form>
                <div className="loginCreateAccountWrapper">
                   <span> New user? </span>
                   <Link to="/register">
                        <span className="loginCreateAccount">CreateAccount</span>
                   </Link>
                </div>

            </div>

        </div>
        </>
    )
}
