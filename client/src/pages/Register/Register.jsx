import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import "./register.css"
import NavbarSm from '../../componants/navbarSm/NavbarSm'
import { userFetchFailure, userFetchStart, userFetchSuccess } from '../../redux/userReducer'
import { useDispatch, useSelector } from 'react-redux'
import {instance} from '../../axiosInstance'

export default function Register() {

    const [error, seterror] = useState(false)
    const [username, setusername] = useState("")
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    

    const handleRegisterSubmit = async (e) => {
        e.preventDefault()

        dispatch(userFetchStart())
        try {
            const res = await axios.post("auth/register", {
                username: username,
                email: email,
                password: password
            })
            if(res.data){
                window.location.replace("login")  
            }
        } catch (error) {
            dispatch(userFetchFailure())
        }

    }

    return (
        <>
        <NavbarSm/>
        <div className='Register'>
            
            <div className="RegisterWrapper">

                <h1 className="RegisterTitle">MANDALA</h1>

                <div className="RegisterSubTitle">Register</div>
                <form className="RegisterForm" onSubmit={handleRegisterSubmit}>
                    <input type="text" className="Registername" required placeholder='name' onChange={(e) => setusername(e.target.value)}/>
                    <input type="email" className="Registeremail" required placeholder='email' onChange={(e) => setemail(e.target.value)} />
                    <input type="password" className="Registerpassword" min={3} required placeholder='password' onChange={(e) => setpassword(e.target.value)} />
                    <input type="password" className="Registerpasswordagain" min={3} required placeholder='re-enter password' />
                    { user.error && <h4 className="Registererror">Wrong Username or Password</h4>}
                    <button className="RegisterBtn" type='submit'>Register</button>
                </form>
                <div className="RegisterCreateAccountWrapper">
                   <span> already have an account? </span>
                   <Link to="/login">
                        <span className="RegisterCreateAccount">Login</span>
                   </Link>
                </div>

            </div>

        </div>
        </>
    )
}
