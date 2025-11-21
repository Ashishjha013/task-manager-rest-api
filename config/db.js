// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI is not defined in environment variables');
    process.exit(1);
  }

  try {
    // modern mongoose doesn't require useNewUrlParser/useUnifiedTopology flags,
    // but explicit options are harmless and make intent clear.
    const conn = await mongoose.connect(uri, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true, // removed in newer mongoose
      // useFindAndModify: false // removed in newer mongoose
    });

    console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // optionally log error.stack in dev
    if (process.env.NODE_ENV !== 'production') console.error(error.stack);
    // crash fast — the app can't run without DB
    process.exit(1);
  }
};

module.exports = connectDB;
