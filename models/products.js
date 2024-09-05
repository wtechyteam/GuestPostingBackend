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
        
    },
    contentSize: {
        type: Number,
        
    },
    links: {
        type: Number
    },
    tat: {
        type: Number
    },

    // New fields
    contentPlacement: {
        type: Number
    },
    writingAndPlacement: {
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
    totalTraffic: {
        type: Number
    },
    markedSponsoredBy: {
        type: Boolean
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
    }

}, { timestamps: true });

// Adding full-text search index
productsSchema.index({ URL: 'text', tags: 'text', language: 'text', country: 'text', ahrefsDRrange: 'text' });

const Products = model('Products', productsSchema);

module.exports = Products;
