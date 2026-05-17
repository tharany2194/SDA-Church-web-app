const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = 'mongodb+srv://tharanysivapaskaran_db_user:nWMLHCbbHpC2V5br@sda-varatharajapuram-ch.m0cmpmm.mongodb.net/?appName=sda-varatharajapuram-church-web-app';

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected successfully to database');
    const db = client.db('test');
    const usersCol = db.collection('users');
    
    // Encrypt password using bcryptjs
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('Password123!', salt);
    
    // Upsert admin2@gmail.com
    const result = await usersCol.updateOne(
      { email: 'admin2@gmail.com' },
      {
        $set: {
          name: 'Test Super Admin',
          email: 'admin2@gmail.com',
          password: hashedPassword,
          role: 'super_admin',
          isActive: true,
          preferredLanguage: 'en',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );
    
    console.log('Upsert result:', result);
    
    const user = await usersCol.findOne({ email: 'admin2@gmail.com' });
    console.log('Created/Updated user:', { email: user.email, role: user.role });
    
  } catch (err) {
    console.error('Error running script:', err);
  } finally {
    await client.close();
  }
}

run();
