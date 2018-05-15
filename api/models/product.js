const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    // name: String,
    name: {
        type: String,
        required: true
    },
    // price: Number,
    price: {
        type: Number,
        required: true
    },
    productImage: {
        type: String
    }
});

module.exports = mongoose.model('Product', productSchema);