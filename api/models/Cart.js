const mongoose = require('mongoose')


const CartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    products: [
        {
            productId: {
                type: String,
                unique: true
            }
        }
    ],
    quantity: {
        type: Number,
        required: true,
        default: 0
    },
    total: {
        type: Number,
        required: true,
        default: 0
    }


}, {timestamps:true})

module.exports = mongoose.model("Cart", CartSchema)