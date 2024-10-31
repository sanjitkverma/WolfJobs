const mongoose = require('mongoose');
require('dotenv').config(); // Assuming you're using dotenv for environment variables

console.log("process.env.MONGODB_URI", process.env.MONGODB_URI)
const dbUrl = 'mongodb://127.0.0.1:27017/wolfjobs_development';

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error connecting to mongodb'));

db.once('open', function() {
    console.log('Connected to database :: MongoDB')
})


module.exports = db;