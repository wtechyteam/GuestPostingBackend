const { Schema, model } = require('mongoose');

const blockedProductsSchema = new Schema ({
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
      blockedAt: {
        type: Date,
        default: Date.now,
      },
},
{timestamps: true}
);

const blockedProducts = model('blockedProducts', blockedProductsSchema);
module.exports = blockedProducts;