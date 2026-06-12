const mongoose = require('mongoose');
// const { type } = require('os');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    Image: { type: String }
});

module.exports = mongoose.model('Category', categorySchema);