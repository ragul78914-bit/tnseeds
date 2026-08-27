const mongoose = require('mongoose');

let isInMemory = false;
const inMemoryData = {
  users: [],
  farmers: [],
  sellers: [],
  crops: [],
  categories: [],
  seeds: [],
  inventories: [],
  transactions: [],
  batches: [],
  suppliers: [],
  customers: [],
  schemes: [],
  notifications: [],
  auditLogs: []
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart_seed_db', {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[Database] MongoDB Connection failed: ${error.message}`);
    console.log(`[Database] Switching to Embedded Memory Storage Mode...`);
    isInMemory = true;
    return null;
  }
};

module.exports = {
  connectDB,
  isInMemoryMode: () => isInMemory,
  getMemoryStore: () => inMemoryData
};
