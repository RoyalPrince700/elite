import mongoose from 'mongoose';
import Invoice from './models/Invoice.js';

async function checkInvoices() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eliteretoucher');
    const invoices = await Invoice.find({}).limit(5);
    console.log('Sample invoices:');
    invoices.forEach(invoice => {
      console.log('Invoice ID:', invoice._id, 'Currency:', invoice.currency, 'Amount:', invoice.amount);
    });
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkInvoices();
