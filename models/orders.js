const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
    buyerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sellerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Products',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Order = model('Order', orderSchema);

module.exports = Order;
