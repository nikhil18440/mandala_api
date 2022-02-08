const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken")
const Product = require("../models/Product")

const router = require("express").Router()


//create Product
router.post("/", verifyTokenAndAdmin, async (req,res) => {
    const newProduct = new Product(req.body)

    try {
        
        const savedProduct = await newProduct.save()
        res.status(200).json(savedProduct)

    } catch (error) {
        res.status(400).json(error)
    }
})


//update product
router.put("/:id", verifyTokenAndAdmin, async (req,res) => {
    
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new:true})
        res.status(200).json(updatedProduct)
    } catch (error) {
        res.status(400).json(error)
    }

})

//update product ordered
router.put("/ordered/:id", verifyTokenAndAuthorization, async (req,res) => {
    
    try {
        const updatedProduct = await Product.updateMany({
            _id: {
                $in: req.body.products
            }
        },{
            $set : {ordered : true}
        }, {new:true})
        res.status(200).json(updatedProduct)
    } catch (error) {
        res.status(400).json(error)
    }

})

// router.put("/ordered/:id", verifyTokenAndAuthorization, async (req,res) => {
    
//     try {
//         const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
//            $match : {

//            }
//         }, {new:true})
//         res.status(200).json(updatedProduct)
//     } catch (error) {
//         res.status(400).json(error)
//     }

// })


//delete product
router.delete("/:id", verifyTokenAndAdmin, async (req,res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Product has been deleted...")
    } catch (error) {
        res.status(500).json(error)
    }
})


//get product
router.get("/:id", async (req,res) => {
    try {
        const product = await Product.findById(req.params.id)
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json(error)
    }
})

//get all products
router.get("/",  async (req,res) => {
    const qNew = req.query.new
    try {
        let products

        if (qNew) {
            products = await Product.find({
                ordered: {
                    $in : false
                }
            }).sort({createdAt: -1}).limit(3)
        }else{
            products = await Product.find()
        }

        res.status(200).json(products)
    } catch (error) {
        res.status(500).json(error)
    }
})


module.exports = router