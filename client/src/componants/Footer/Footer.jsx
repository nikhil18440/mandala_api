import { Instagram } from '@material-ui/icons'
import React from 'react'
import "./footer.css"

export default function Footer() {
    return (
        <div className='footer'>
            
            <div className="socialMedia">
                <div className="footerTitle">Also Follow us on</div>
                <div className="socialMediaIcons">
                    <a className='link' href="https://www.instagram.com/a_k_._a_r_t_s/"><Instagram className="socialMediaIcon"/></a>
                </div>
                <div className="copyright">@www.mandala.com</div>
            </div>

        </div>
    )
}
