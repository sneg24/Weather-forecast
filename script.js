// script.js

const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY';
let map;
let marker;

// Initialize Google Maps
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 48.8566, lng: 2.3522 }, // Default to Paris
    zoom: 5,
  });
}

// Get weather and update map location
async function getWeather() {
  const city = document.getElementById('city').value;
  const weatherContainer = document.getElementById('weather-forecast');
  weatherContainer.innerHTML = 'Loading...';

  try {
    // Fetch weather data
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=7&appid=${apiKey}&units=metric`
    );

    if (!response.ok) throw new Error('City not found');

    const data = await response.json();
    displayWeather(data);

    // Fetch city coordinates for map
    const cityLat = data.city.coord.lat;
    const cityLon = data.city.coord.lon;
    updateMap(cityLat, cityLon);

  } catch (error) {
    weatherContainer.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

// Display weather data
function displayWeather(data) {
  const weatherContainer = document.getElementById('weather-forecast');
  weatherContainer.innerHTML = ''; // Clear previous results

  data.list.forEach((forecast, index) => {
    const date = new Date(forecast.dt * 1000).toLocaleDateString();
    const temp = forecast.main.temp;
    const description = forecast.weather[0].description;
    const icon = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;

    // Create forecast card
    const forecastCard = document.createElement('div');
    forecastCard.className = 'forecast-day';
    forecastCard.innerHTML = `
      <h3>${date}</h3>
      <img src="${icon}" alt="${description}">
      <p>Temperature: ${temp} °C</p>
      <p>${description.charAt(0).toUpperCase() + description.slice(1)}</p>
    `;

    weatherContainer.appendChild(forecastCard);
  });
}

// Update map with city coordinates
function updateMap(lat, lon) {
  const position = { lat, lng: lon };

  // Center map on selected city
  map.setCenter(position);
  map.setZoom(8);

  // Place marker
  if (marker) marker.setMap(null);
  marker = new google.maps.Marker({
    position,
    map,
    title: document.getElementById('city').value,
  });
}
