const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMDAyNmY0Y2E5YTZlZjYwZjk1MDBjMCIsInJvbGUiOiJzdXBlcl9hZG1pbiIsImlhdCI6MTc4MTA3Mzk2MiwiZXhwIjoxNzgxNjc4NzYyLCJpc3MiOiJjaHVyY2gtbWFuYWdlbWVudC1hcGkiLCJqdGkiOiJhMGZlYTI0MC01MzRkLTRlMmQtYjkwYy1lNTFhOTQ3NmNmMDgifQ.uTUY1ukV5s5aYhggzLTKGVoQ-3g8pmv0M2Whuy-idOc";

fetch('http://localhost:3000/api/v1/auth/refresh', {
    method: 'POST',
    headers: {
        'Cookie': `refreshToken=${token}`,
        'Content-Type': 'application/json'
    }
}).then(r => r.json().then(data => console.log('Status:', r.status, 'Body:', data)))
    .catch(console.error);
