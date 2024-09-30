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
        enum: ['Publisher Acceptance', 'In Progress', 'Your Approval', 'Improvement', 'Completed', 'Rejected', 'Archived'],
        default: 'In Progress'
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
