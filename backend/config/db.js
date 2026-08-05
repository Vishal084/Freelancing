// Polyfill global crypto for Node < 19/20 compatibility with Mongoose
const crypto = require('crypto');
if (!globalThis.crypto) {
  globalThis.crypto = crypto;
}

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error:::::::  ${error.message}`);
    // process.exit(1); it terminate the running server
  }
};

module.exports = connectDB;