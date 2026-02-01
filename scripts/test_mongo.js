require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;
console.log('Testing URI:', uri ? 'Found' : 'Missing');

if (!uri) process.exit(1);

mongoose.connect(uri)
    .then(() => {
        console.log('Successfully connected to MongoDB!');
        process.exit(0);
    })
    .catch(err => {
        console.error('Connection Failed:', err);
        process.exit(1);
    });
