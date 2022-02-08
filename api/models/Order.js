const mongoose = require('mongoose')


const OrderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    products: [
        {
            productId: {
                type: String,
                required: true
            },
            status: {
                type: String,
                default: "pending"
            }
        }
    ],
    amount: {
        type: Number,
        required: true,
        default: 0
    },
    address: {
        type: Object,
        required: true
    }



}, {timestamps:true})

module.exports = mongoose.model("Order", OrderSchema)