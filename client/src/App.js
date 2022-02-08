import Home from "./pages/Home/Home";
import "./app.css"
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import Products from "./pages/Products/Products";
import SingleProduct from "./pages/SingleProduct/SingleProduct";
import CartPage from "./pages/CartPage/CartPage";
import Profile from "./pages/Profile/Profile";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios'
import {instance} from './axiosInstance'
import { useEffect, useState } from "react";
import { delProduct, setCart } from "./redux/cartRedux";
import OrderPage from "./pages/OrderPage/OrderPage";

function App() {
  
  const user = useSelector(state => state.user)
  const cart = useSelector(state => state.cart) 
  const dispatch = useDispatch()

  const [price, setprice] = useState(0);


  const removefromDbCart = async (Cart) => {
      try {
        // let res
        console.log(Cart);
        Cart.products.map(async (item) => {
          console.log(item)
          try {
            console.log("Cart pro: ", Cart.products);
            const eachItem = await axios.get("/product/"+item._id)
            console.log(eachItem.data);
            if(eachItem.data.ordered === true){
              console.log("Cart pro: ", Cart.products);
              const newCart = Cart.products.filter(Single => Single._id !== eachItem.data._id)
              console.log(newCart);
              const res = await instance.put("/cart/"+user.user._id, {
                _id: Cart._id,
                products: newCart,
                quantity: newCart.length,
                total: Cart.total - eachItem.data.price
              })
              console.log("doneCart: ", res.data);
              sessionStorage.setItem('cartId', JSON.stringify(res.data))
              dispatch(setCart(res.data))

            }
            
          } catch (error) {
            console.log(error);
          }
        })
        
        
      } catch (error) {
          console.log(error)
      }
    }


  const findcart = async () => {
      if(cart.cart === null){
       
          const res = await instance.get("/cart/find/"+user.user._id)
          if(res.data === null && user.user){
            
            const newCart = await instance.post("/cart/"+user.user._id, {
                userId: user.user._id,
                products: []
            })
            
            dispatch(setCart(newCart.data))
            sessionStorage.setItem('cartId', JSON.stringify(newCart.data))
          }else{
            if(res.data){
              removefromDbCart(res.data)
              sessionStorage.setItem('cartId', JSON.stringify(res.data))
              dispatch(setCart(res.data))

              // res.data.products.map(item => {
              //   removefromDbCart({Cart: res.data, product: item})
              // })
            }
            
          }
      }else{
        console.log("the else loop is executing");
        const localUser = JSON.parse(sessionStorage.getItem('cartId'))
        if(localUser){
          dispatch(setCart(localUser))
        }
      }
  }



  const findorder = async () => {     
      const res = await instance.get("/order/"+user.user._id)
      console.log(res.data)
      if(res.data === null || res.data.length === 0){
        
        const newOrder = await instance.post("/order/"+user.user._id, {
            userId: user.user._id,
            products: [],
            address: user.user.address || ""
        })
        console.log(newOrder.data)
        sessionStorage.setItem('order', JSON.stringify(newOrder.data))
      }else{
        sessionStorage.setItem('order', JSON.stringify(res.data))
      }
  }
  
  useEffect(() => {
    if(user.user){
        console.log("user: ",user.user)
        findorder()
        if(cart.cart === null){
          findcart()
        }
    }
  }, [])






  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route path="/products" element={<Products/>} />
          <Route path="/singleProduct/:id" element={user.user ? <SingleProduct/> : <Navigate to="/login"/> } />
          <Route path="/cart" element={user.user ? <CartPage/> : <Navigate to="/login"/> } />
          <Route path="/profile" element={user.user ? <Profile/> : <Navigate to="/login"/> } />
          <Route path="/order/:id" element={user.user ? <OrderPage/> : <Navigate to="/login"/> } />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
