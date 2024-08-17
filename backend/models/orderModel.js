const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now },
    status: { type: String, default: 'Pending' }
});

const Order = mongoose.model('Order', orderSchema)

module.exports = Order;