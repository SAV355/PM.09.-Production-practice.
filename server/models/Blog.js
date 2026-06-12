const { create } = require('domain');
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String },
    author: { type: String, required: true },
    createdAt: { type: String, default: Date.now }
});

module.exports = mongoose.model('Blog', blogSchema);
