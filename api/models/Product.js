const mongoose = require('mongoose')


const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    img: {
        type: Array,
        required: true,
    },
    size: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    ordered: {
        type: Boolean,
        required: true,
        default: false
    }
}, {timestamps:true})

module.exports = mongoose.model("Product", ProductSchema)