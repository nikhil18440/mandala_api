import React, { useRef } from 'react'
import "./message.css"
import emailjs from 'emailjs-com'
import dotenv from 'dotenv'
dotenv.config()

export default function Message() {

    const formRef = useRef()

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(process.env);
        emailjs.sendForm(process.env.REACT_APP_SERVICE_ID , process.env.REACT_APP_TEMPLATE_ID , formRef.current, process.env.REACT_APP_USER_ID )
        .then((result) => {
            console.log(result);
        }, (error) => {
            console.log(error.text);
        });
    }

    return (
        <div className='message'>

            <div className="messageTitle">Any queries? Let us know</div>
            

            <form ref={formRef } className='messageForm' onSubmit={handleSubmit}>
                <div className="colorbox"></div>
                <input type="text" name='user_name' required className="messagename msgInput" placeholder='name'/>
                <input type="email" name='user_email' required className="messageemail msgInput" placeholder='email'/>
                <input type="text" name='user_subject' required className="messagesubject msgInput" placeholder='subject'/>
                <textarea name="message" required className="messageArea msgInput" placeholder='type your message...' />
                <button className="msgBtn msgInput">SEND</button>
            </form>

        </div>
    )
}
