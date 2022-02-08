import {createSlice} from '@reduxjs/toolkit'

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cart: null,
        quantity: 0,
        total: 0
    },
    reducers: {
        setCart: (state,action) => {
            state.cart = action.payload
            state.quantity = action.payload.products.length
            state.total = action.payload.total
        },
        addProduct: (state,action) => {
            state.quantity = state.quantity + 1
            state.cart.products.push(action.payload)
            state.total = state.total + action.payload.price
        },
        delProduct: (state,action) => {
            state.quantity = state.quantity - 1
            state.cart.products.filter(item => item._id !== action.payload._id)
            state.total = state.total - action.payload.price
        },
        setCartTotal: (state,action) => {
            state.total += action.payload
        }
    }
})


export const {addProduct,delProduct,setCart,setCartTotal} = cartSlice.actions
export default cartSlice.reducer

