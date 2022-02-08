const { verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyToken } = require("./verifyToken")
const Cart = require("../models/Cart")
const Order = require("../models/Order")

const router = require("express").Router()


//create order
router.post("/:id", verifyTokenAndAuthorization, async (req,res) => {
    const newOrder = new Order(req.body)
    try {
        const savedOrder = await newOrder.save()
        res.status(200).json(savedOrder)
    } catch (error) {
        res.status(400).json(error)
    }
})


// update order
router.put("/:id", verifyTokenAndAuthorization, async (req,res) => {
    
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.body.orderId, {
            $push: {
                "products": {
                    productId: req.body.productId
                }
            }
        }, {new:true})
        res.status(200).json(updatedOrder)
    } catch (error) {
        res.status(400).json(error)
    }

})


//delete product
// router.delete("/:id", verifyTokenAndAdmin, async (req,res) => {
//     try {
//         await Order.findByIdAndDelete(req.params.id)
//         res.status(200).json("Order has been deleted...")
//     } catch (error) {
//         res.status(500).json(error)
//     }
// })


//get user order
router.get("/:id", verifyTokenAndAuthorization, async (req,res) => {
    try {
        const orders = await Order.find({userId: req.params.id})
        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json(error)
    }
})

//get all orders
// router.get("/find/", verifyTokenAndAdmin,  async (req,res) => {
//     try {
//         const orders = await Order.find()
//         res.status(200).json(orders)
//     } catch (error) {
//         res.status(500).json(error)
//     }
// })


//get monthly income
router.get("/income", verifyTokenAndAdmin, async (req,res) => {
    const date = new Date()
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
    const prevMonth = new Date(date.setMonth(lastMonth.getMonth() - 1))

    try {
        
        const income = await User.aggregate([
            {$match: {createdAt: {$gte: prevMonth}}},
            {
                $project: {
                    month: {$month: "$createdAt"},
                    sales: "$amount"
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: {$sum: "$sales"}
                }
            }
        ])
        res.status(200).json(income)

    } catch (error) {
        res.status(400).json(error)
    }
})


module.exports = router