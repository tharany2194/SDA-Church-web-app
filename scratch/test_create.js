const axios = require('axios');

async function testCreate() {
  try {
    // Note: This might fail without auth, but let's see
    const res = await axios.post('http://localhost:3000/api/v1/verses', {
      contentEn: "Testing schema",
      contentTa: "சோதனை",
      reference: "Test 1:1",
      referenceTa: "சோதனை 1:1"
    });
    console.log('Created Verse:', JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
}

testCreate();
