const mongoose = require('mongoose');

const ShoppingItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isChecked: { type: Boolean, default: false },
  space: { type: mongoose.Schema.Types.ObjectId, ref: 'Space', required: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('ShoppingItem', ShoppingItemSchema);
