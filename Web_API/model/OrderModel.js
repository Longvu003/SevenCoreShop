const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Định nghĩa Order Schema
const orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    // name: {
    //   type: String,
    //   required: true,
    // },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be greater than or equal to 1']
    },
    total: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'canceled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'paypal', 'momo', 'cash_on_delivery'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'failed'],
    default: 'unpaid'
  },
  deliveryStatus: {
    type: String,
    enum: ['pending', 'shipped', 'delivered'],
    default: 'pending'
  },
  payUrl: {
    type: String
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Mongoose Middleware to automatically update `updatedAt` field
orderSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Định nghĩa Order Model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
