const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

require('dotenv').config();

app.use(express.static(path.join(__dirname, '.')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'));
});


app.get('/api/location', async (req, res) => {
  const IPSTACK_KEY = process.env.IPSTACK_KEY;
  try {
    const response = await fetch(`http://api.ipstack.com/check?access_key=${IPSTACK_KEY}`);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    // console.log('Location data:', data); // Log the location data
    res.json(data);
  } catch (error) {
    console.error('Error fetching location data:', error);
    res.status(500).json({ error: 'Failed to fetch location data' });
  }
});


app.get('/api/weather/:lat/:lon', async (req, res) => {
  const { lat, lon } = req.params;
  const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    // console.log('Weather data:', data); // Log the weather data
    res.json(data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

