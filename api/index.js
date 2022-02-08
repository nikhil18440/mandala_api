const express = require("express")
const mongoose = require("mongoose")
const cors = require('cors')
const dotenv = require('dotenv')
const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")
const productRoute = require("./routes/product")
const cartRoute = require("./routes/cart")
const orderRoute = require("./routes/order")

const app = express()

app.use(express.json())
app.use(cors({origin: '*'}))
dotenv.config()


//stripe payment
const stripe = require('stripe')(process.env.STRIPE_KEY)
app.post("/api/checkout/payment", async (req,res) => {
    // await stripe.charges.create({
    //     source: req.body.tokenId,
    //     amount: req.body.amount,
    //     currency: "inr",
    // }, (stripeErr, stripeRes) => {
    //     if(stripeErr){
    //         res.status(400).json(stripeErr)
    //     }else{
    //         res.status(200).json(stripeRes)
    //     }
    // })
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: 'inr'
        })
        res.status(200).json({
            clientSecret: paymentIntent.client_secret
        })
    } catch (error) {
        res.status(500).json(error)
    }
})


mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true
}).then(() => {
    console.log("connected to mongodb")
}).catch((err) => {
    console.log(err)
})



app.use("/api/auth", authRoute)
app.use("/api/user", userRoute)
app.use("/api/product", productRoute)
app.use("/api/cart", cartRoute)
app.use("/api/order", orderRoute)
// app.use("/api/checkout", stripeRoute)




app.listen(process.env.PORT , () => {
    console.log("this is port 5000")
})