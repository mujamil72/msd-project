import fetch from 'node-fetch';

const testServer = async () => {
  try {
    console.log('Testing server health...');
    const response = await fetch('http://localhost:5000/api/health');
    const data = await response.json();
    console.log('Health check:', data);
    
    console.log('Testing CORS...');
    const corsResponse = await fetch('http://localhost:5000/api/auth/register', {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:5173',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    console.log('CORS status:', corsResponse.status);
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
};

testServer();