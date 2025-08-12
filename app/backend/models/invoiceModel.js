const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session'
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Overdue', 'Cancelled'],
    default: 'Pending'
  },
  dueDate: {
    type: Date,
    required: true
  },
  items: [{
    description: String,
    quantity: Number,
    unitPrice: Number,
    total: Number
  }],
  payments: [{
    amount: Number,
    date: Date,
    method: String,
    transactionId: String
  }],
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Invoice', invoiceSchema);
