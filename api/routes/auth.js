const router = require("express").Router()
const User = require("../models/User")
const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")


//REGISTER
router.post("/register", async (req,res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET_KEY).toString(),
    })

    try {
        
        const savedUser = await newUser.save()
        res.status(200).json(savedUser)

    } catch (error) {
        res.status(400).json(error)
    }
})


//LOGIN
router.post("/login", async (req,res) => {
    
    try {
        const user = await User.findOne({email: req.body.email})

        if (user) {
            const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SECRET_KEY)
            const Originalpassword = hashedPassword.toString(CryptoJS.enc.Utf8)

            if (Originalpassword === req.body.password) {
                const {password, ...others} = user._doc

                const accesstoken = jwt.sign({
                    id: user._id,
                    isAdmin: user.isAdmin
                }, process.env.JWT_SECRET_KEY,
                    {expiresIn:"3d"})

                res.status(200).json({...others, accesstoken})
            }else{
                res.status(400).json("wrong password")
            }
        }else{
            res.status(400).json("wrong credentials")
        }

    } catch (error) {
        res.status(400).json(error)
    }

})







module.exports = router