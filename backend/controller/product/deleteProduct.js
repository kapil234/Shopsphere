const productModel = require("../../models/productModel")
const addToCartModel=require("../../models/cartProduct")
const deleteProduct = async(req,res)=>{
    try{
        const currentUserId = req.userId 
        const getProductId = req.body._id

        const deleteProduct = await productModel.deleteOne({ _id :getProductId})
         await addToCartModel.deleteMany({ productId: getProductId });

        res.json({
            message : "Product Deleted ",
            error : false,
            success : true,
            data : deleteProduct
        })

    }catch(err){
        res.json({
            message : err?.message || err,
            error : true,
            success : false
        })
    }
}
module.exports=deleteProduct