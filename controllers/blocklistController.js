const User = require('./../models/users');  
const Product = require('./../models/products');

exports.blockProduct = async(req,res) => {
    try {
        const userId = req.user.id;
        console.log("User ID:", userId);
        const productId = req.params.productId;

        const user = await User.findById(userId);

        if(user.blockedProducts.includes(productId)){
            return res.status(400).json({message: 'Product is already blocked. '});
            }
            user.blockedProducts.push(productId);
            await user.save();

            return res.status(200).json({ message: 'Product blocked successfully.'});
    } catch(error){
        return res.status(500).json({message: 'Error blocking product.', error: error.message});
    }
}

exports.unblockProduct = async(req,res) => {
    try{
        const userId = req.user.id;
        const productId = req.params.productId

        const user = await User.findById(userId);

        const productIndex = user.blockedProducts.indexOf(productId);

        if(productIndex === -1){
            return res.status(400).json({message: 'Product is not blocked'});
        }

        user.blockedProducts.splice(productIndex, 1);
        await user.save();
        return res.status(200).json({ message: 'Product unblocked successfully.'});
    } catch(error){
        return res.status(500).json({message: 'Error unblocking product.', error: error.message});
    }
}