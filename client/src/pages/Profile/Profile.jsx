import React, { useEffect, useState } from 'react'
import "./profile.css"
import noAvatar from "../../assets/no_avatar.jpg"
import Navbar from '../../componants/navbar/Navbar'
import bgPattern from "../../assets/blue_pattern2.jpg"
import { Close, Edit } from '@material-ui/icons'
import { useDispatch, useSelector } from 'react-redux'
import { instance } from '../../axiosInstance'
import { userFetchSuccess } from '../../redux/userReducer'
import { storage } from '../../firebase' 

export default function Profile() {

    const [editOn, seteditOn] = useState(false)
    const [inputFile, setinputFile] = useState("")
    const [previewImg, setpreviewImg] = useState()

    const user = useSelector(state => state.user)
    const [profilePic, setprofilePic] = useState(null)
    const [profilePicURL, setprofilePicURL] = useState(null)
    const [username, setusername] = useState()
    const [email, setemail] = useState()
    const [address, setaddress] = useState()
    const [pincode, setpincode] = useState()
    const [country, setcountry] = useState()
    const [state, setstate] = useState()
    const [phoneNumber, setphoneNumber] = useState()
    const dispatch = useDispatch()
    const localUser = JSON.parse(sessionStorage.getItem('user'))

    
    

    const handleUploadImage = (e) => {
        const reader = new FileReader()
        reader.addEventListener("load", () => {
            setinputFile(reader.result)
        })
        reader.readAsDataURL(e.target.files[0])


        if(e.target.files[0]){
            setprofilePic(e.target.files[0])
            console.log("image: ",profilePic);
            console.log()
        }
    }


    const handleEditOn = () => {
        seteditOn(!editOn)
    }

    //update submit
    const handleProfileUpdate = async () => {
        
       
        if(profilePic){

             //uploading image to firebase
            const uploadTask = storage.ref(`images/${user.user.email}/${profilePic.name}`).put(profilePic)
            uploadTask.on(
                "state_changed",
                snapshot => {},
                error => {
                    console.log(error);
                },
                () => {
                    storage
                        .ref(`images/${user.user.email}`)
                        .child(profilePic.name)
                        .getDownloadURL()
                        .then(url => {
                            console.log(url);
                            setprofilePicURL(url)
                            updateProfileDB(url)
                        }).catch(e => {
                            console.log(e)
                        })
                }
            )
        }else{
            updateProfileDB()
        }

    }

    
      
       
    

    const updateProfileDB = async (url) => {
        let updatedUser = {
            username,
            email,
            pincode,
            phoneNumber,
            address,
            country,
            state,
            profilePic: url ? url : localUser.profilePic,
            accesstoken: localUser.accesstoken
        }

            //uploading image to mongodb
        try {
            const res = await instance.put("https://mandala-api.vercel.app/api/user/"+user.user._id , updatedUser)
            if(res.data){
                dispatch(userFetchSuccess(res.data))
                sessionStorage.setItem('user', JSON.stringify(res.data))
                console.log(res.data)
            }

            if(res.data && url && user.user.profilePic !== ""){
                const oldPhoto = storage.refFromURL(user.user.profilePic)
                oldPhoto.delete()
            }
        } catch (error) {
            console.log(error)
        }
        seteditOn(false)
        
    }
        

    


    return (
        <>
        <Navbar/>
        <div className='profile'>
            
            
            <div className="profileTop">
                <img src={bgPattern} alt="" className="profilebgImg" />
                <div className='profilecolorbox'></div>

                {
                    editOn ? (
                        <>
                        <label htmlFor="profimg">
                            <img src={inputFile ? inputFile : user.user.profilePic ? user.user.profilePic : noAvatar  } alt="" className="profileImg" />
                        </label>
                        <input id='profimg' accept='image/*' type="file" onChange={handleUploadImage} className='profileTopImg' />
                        </>
                    ) : (
                        <img src={profilePicURL ? profilePicURL : user.user.profilePic ? user.user.profilePic : noAvatar} alt="" className="profileImg" style={{cursor: 'default' }} />
                    )
                }
                
                {/* <div className='profileEditOptions'> */}
                {
                    editOn && <button className='profileSaveBtn' onClick={handleProfileUpdate}>SAVE</button>
                }
                <span className="profileEditBtn" style={editOn ? {backgroundColor: 'red'} : {backgroundColor: 'teal'}} onClick={handleEditOn}>
                    {
                        editOn ? (
                                <Close className='profileEditBtnIcon'/>
                            ) : (
                                <Edit className='profileEditBtnIcon'/>
                                )
                            }
                </span>
                {/* </div> */}
                {/* <h1 className="profilenameTitle">Hi James!</h1> */}
            </div>

            <div className="profileBottom">
                
                {/* <div className="profileNameDiv"> */}
                    <label htmlFor="name">name: </label>
                    {
                        editOn ? (
                            <input type="text" id="name" className="profilenameInput" placeholder={user.user.username} onChange={(e) => setusername(e.target.value)} />
                        ) : (
                            <div className="profilenameInput">{user.user.username}</div>
                        )
                    }
                {/* </div> */}

                {/* <div className="profileEmailDiv"> */}
                    <label htmlFor="email">email: </label>
                    {
                        editOn ? (
                            <input type="email" id="email" className="profileemailInput" placeholder={user.user.email} onChange={(e) => setemail(e.target.value)} />
                        ) : (
                            <div className="profileemailInput">{user.user.email}</div>
                        )
                    }
                {/* </div> */}

                {/* <div className="profilePincodeDiv"> */}
                    <label htmlFor="pincode">pincode: </label>
                {
                    editOn ? (
                        <input type="number" id="pincode" className="profilepincodeInput" placeholder={user.user.pincode} onChange={(e) => setpincode(e.target.value)} />
                    ) : (
                        <div className="profileemailInput">{user.user.pincode}</div>
                    )
                }
                {/* </div> */}

                {/* <div className="profilePhoneNumberDiv"> */}
                    <label htmlFor="phoneNumber">phoneNumber: </label>
                    {
                        editOn ? (
                            <input type="number" id="phoneNumber" className="profilephoneNumberInput" placeholder={user.user.phoneNumber} onChange={(e) => setphoneNumber(e.target.value)} />
                        ) : (
                            <div className="profileemailInput">{user.user.phoneNumber}</div>
                        )
                    }
                {/* </div> */}

                
                
                <label htmlFor="country">Country: </label>
                <h6 className='profileCountryDesc'>currently available only in India</h6>
                {
                    editOn ? (
                        <input type="text" id="country" className="profileCountryInput" placeholder={user.user.country} onChange={(e) => setcountry(e.target.value)} />
                    ) : (
                        <div className="profileemailInput">{user.user.country}</div>
                    )
                }
                
                
                <label htmlFor="state">State: </label>
                {
                    editOn ? (
                        <input type="text" id="state" className="profileStateInput" placeholder={user.user.state} onChange={(e) => setstate(e.target.value)} />
                    ) : (
                        <div className="profileemailInput">{user.user.state}</div>
                    )
                }
               
                    <label htmlFor="address">address: </label>
                    {
                        editOn ? (
                            <textarea type="text" id="address" className="profileaddressInput" placeholder={user.user.address} onChange={(e) => setaddress(e.target.value)} />
                        ) : (
                            <div className="profileemailInput">
                                {user.user.address}
                            </div>
                        )
                    }
                {/* </div> */}

            </div>
        </div>
        </>
    )
}
