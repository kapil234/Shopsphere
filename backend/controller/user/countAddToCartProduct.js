const addToCartModel = require("../../models/cartProduct")

const countAddToCartProduct = async(req,res)=>{
    try{
        const userId = req.userId

        // Count only cart items whose productId still exists
        const count = await addToCartModel.countDocuments({
            userId : userId,
            productId: { $ne: null }  // ignore deleted products
        })

        res.json({
            data : { count },
            message : "ok",
            error : false,
            success : true
        })
    }catch(error){
        res.json({
            message : error.message || error,
            error : false,
            success : false,
        })
    }
}

module.exports = countAddToCartProduct
