import React, { useEffect, useState } from 'react'
import LatestItem from './latestItem/LatestItem'
import axios from 'axios'
import "./latest.css"

export default function Latest() {

    return (
        <div className='latest'>
            <div className="title">Latest &nbsp; Artworks</div>
            <div className="latestitems">
                {/* {
                    latestArray.map(item => (
                        <LatestItem latestItem={item}/>
                    ))
                } */}
            </div>
        </div>
    )
}
