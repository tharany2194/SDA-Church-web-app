const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://tharanysivapaskaran_db_user:nWMLHCbbHpC2V5br@sda-varatharajapuram-ch.m0cmpmm.mongodb.net/?appName=sda-varatharajapuram-church-web-app';

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected successfully to database');
    const db = client.db('test'); // The database name in connection string, or defaults to test/production
    
    // Let's list collections to find the correct database and collection names
    const collections = await db.listCollections().toArray();
    console.log('Collections in database:', collections.map(c => c.name));
    
    const usersCol = db.collection('users');
    
    // Find all users
    const allUsers = await usersCol.find({}).toArray();
    console.log('All Users in DB:', allUsers.map(u => ({ email: u.email, role: u.role })));
    
    // Update admin@gmail.com and tharany@gmail.com to super_admin
    const result = await usersCol.updateMany(
      { email: { $in: ['admin@gmail.com', 'tharany@gmail.com'] } },
      { $set: { role: 'super_admin' } }
    );
    
    console.log(`Matched ${result.matchedCount} document(s) and modified ${result.modifiedCount} document(s)`);
    
    // Double check roles after update
    const updatedUsers = await usersCol.find({ email: { $in: ['admin@gmail.com', 'tharany@gmail.com'] } }).toArray();
    console.log('Updated Users:', updatedUsers.map(u => ({ email: u.email, role: u.role })));
    
  } catch (err) {
    console.error('Error running promotion:', err);
  } finally {
    await client.close();
  }
}

run();
