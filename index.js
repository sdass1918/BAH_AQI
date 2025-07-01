const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3000;

const aqiMap = {
  1: { label: "Good", color: "green", advice: "Air is clean. Enjoy outdoor activities!" },
  2: { label: "Fair", color: "yellow", advice: "Acceptable air quality." },
  3: { label: "Moderate", color: "orange", advice: "Sensitive groups should take caution." },
  4: { label: "Poor", color: "red", advice: "Limit outdoor activities." },
  5: { label: "Very Poor", color: "purple", advice: "Avoid outdoor exposure." }
};

app.get('/api/aqi-by-name', async (req, res) => {
  const city = req.query.city;
  const API_KEY = process.env.OPENWEATHER_API_KEY;

  if (!city) return res.status(400).json({ error: 'City name required' });

  try {
    // Step 1: Get lat/lon from city
    const geoResp = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`);
    const location = geoResp.data[0];

    if (!location) return res.status(404).json({ error: 'City not found' });

    const { lat, lon, name } = location;

    // Step 2: Get AQI data
    const aqiResp = await axios.get(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );

    const aqiIndex = aqiResp.data.list[0].main.aqi;
    const components = aqiResp.data.list[0].components;
    const info = aqiMap[aqiIndex];

    res.json({
      city: name,
      coordinates: { lat, lon },
      aqi_level: aqiIndex,
      aqi_category: info.label,
      aqi_color: info.color,
      recommendation: info.advice,
      pollutants: {
        pm2_5: components.pm2_5,
        pm10: components.pm10,
        no2: components.no2,
        co: components.co,
        o3: components.o3,
        so2: components.so2
      }
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch AQI by city name' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
