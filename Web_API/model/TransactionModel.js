const mongoose = require('mongoose');

// Định nghĩa schema
const transactionSchema = new mongoose.Schema({
    refNo: { type: String, required: true }, 
    tranId: { type: String, required: true },
    postingDate: { type: Date, required: true },
    transactionDate: { type: Date, required: true },
    accountNo: { type: String, required: true },
    creditAmount: { type: Number, default: 0 },
    debitAmount: { type: Number, default: 0 },
    currency: { type: String, required: true },
    description: { type: String, required: true },
    availableBalance: { type: Number, required: true },
    beneficiaryAccount: { type: String, default: '' }
  }, { timestamps: true });
  
  const Transaction = mongoose.model('Transaction', transactionSchema);
  

module.exports = Transaction;
