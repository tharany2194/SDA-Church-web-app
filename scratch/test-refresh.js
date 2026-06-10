require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

async function run() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const User = require('./models/User').default || require('./models/User');
    const RefreshToken = require('./models/RefreshToken').default || require('./models/RefreshToken');

    const tokenRecord = await RefreshToken.findOne().sort({ createdAt: -1 });
    if (!tokenRecord) {
        console.log('No refresh tokens found in DB!');
        process.exit(0);
    }

    console.log('Found latest token:', tokenRecord.token.substring(0, 20) + '...');

    let decoded;
    try {
        decoded = jwt.verify(tokenRecord.token, process.env.JWT_REFRESH_SECRET);
        console.log('Successfully verified JWT. Payload:', decoded);
    } catch (err) {
        console.log('JWT Verification failed!', err.message);
    }

    const user = await User.findById(decoded?.id || tokenRecord.user);
    if (!user) {
        console.log('User not found by id:', decoded?.id || tokenRecord.user);
    } else {
        console.log('User found:', user.email, 'Active:', user.isActive);
    }

    process.exit(0);
}

run().catch(console.error);
