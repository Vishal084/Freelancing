const Razorpay = require('razorpay');
console.log("env config is required : :::: ", process.env.RAZORPAY_KEY_ID);

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
});

module.exports = instance;
