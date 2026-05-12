const axios = require('axios');

async function checkVerse() {
  try {
    const res = await axios.get('http://localhost:3000/api/v1/verses/today');
    console.log('Current Verse Data:', JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error('Error fetching verse:', err.message);
  }
}

checkVerse();
