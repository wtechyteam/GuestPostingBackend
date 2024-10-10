const { Schema, model} = require('mongoose');

const wishlistProductsSchema = new Schema ({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Products',
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    wishlistedAt: {
        type: Date,
        default: Date.now,
    }, 
},
{ timestamps: true }
);

const wishlistedProducts = model('wishlistedProducts', wishlistProductsSchema);
module.exports = wishlistedProducts