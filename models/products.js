const { Schema, model } = require('mongoose');

const productsSchema = new Schema({

    URL: {
        type: String,
        required: true
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tags: {
        type: [String]
    },
    language: {
        type: String,
        // required: true
    },
    country: {
        type: String,
        // required: true
    },
    pricing: {
        type: Number,
        
    },
    contentSize: {
        type: Number,
        
    },
    links: {
        type: String,

    },
    tat: {
        type: Number
    },
    contentPlacement: {
        type: Number
    },
    writingAndPlacement: {
        type: Number
    },
    specialTopic:{
        type: Number
    },
    extraContent:{
        type: Number
    },
    completionRate: {
        type: Number
    },
    avgLifetimeOfLinks: {
        type: Number
    },
    ahrefsOrganicTraffic: {
        type: Number
    },
    majestic: {
        type: Number
    },
    markedSponsoredBy: {
        type: Boolean,
       
    },
    taskDomainPrice: {
        type: Number
    },
    mozDA: {
        type: Number
    },
    semrushDA: {
        type: Number
    },
    ahrefsDRrange: {
        type: String
    },
    requirements:{
        type:String
    },
    buyingBuyerArticle:{
        type:Boolean
    },
    workExamples:{
        type:String
    },
    priceForLinks:{
        type:Number
    },
    contentTypes:{
        type: [String],
    }
    

}, { timestamps: true });



const Products = model('Products', productsSchema);

module.exports = Products;
