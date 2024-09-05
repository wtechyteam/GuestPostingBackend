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
        type: String // Assuming DR range can be a string like "50-60" or "30-40"
    }

}, { timestamps: true });

// Adding full-text search index
productsSchema.index({ URL: 'text', tags: 'text', language: 'text', country: 'text' });

const Products = model('Products', productsSchema);

module.exports = Products;
