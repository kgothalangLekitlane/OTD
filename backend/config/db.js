const mongoose = require('mongoose');

// dotenv already loaded by server, but load again if runstandalone
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn('MONGODB_URI is not set. Skipping MongoDB connection.');
  module.exports = null;
} else {
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
  });

  module.exports = mongoose;
}
