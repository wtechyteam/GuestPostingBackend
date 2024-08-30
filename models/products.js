const { Schema, model } = require('mongoose');

const productsSchema = new Schema({

    URL: {
        type: String,
        required: true
    },
    tags: {
        type: String
    },
    language: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    pricing: {
        type: Number,
        required: true
    },
    contentSize: {
        type: Number,
        required: true
    },
    links: {
        type: Number
    }

}, { timestamps: true })

const Products = model('Products', productsSchema);

module.exports =  Products;