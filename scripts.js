const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#three-canvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);


camera.position.z = 3;
camera.position.x = -1;
camera.position.y = 2.5;


// Add ambient light
const ambientLight = new THREE.AmbientLight(0x404040, 5);
scene.add(ambientLight);


const controls = new THREE.OrbitControls(camera, renderer.domElement);


const loader = new THREE.GLTFLoader();
loader.load('./models/panuccis_pizza.glb', (gltf) => {
  const myObj = gltf.scene;

  // Center the 3D model
  const boundingBox = new THREE.Box3().setFromObject(myObj);
  const center = boundingBox.getCenter(new THREE.Vector3());
  myObj.position.x += (myObj.position.x - center.x);
  myObj.position.y += (myObj.position.y - center.y);
  myObj.position.z += (myObj.position.z - center.z);

  scene.add(myObj);
}, undefined, (error) => {
    console.error(error);
});


function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function getWeatherEmoji(iconCode) {
  switch (iconCode) {
    case '01d': return '☀️';
    case '01n': return '🌙';
    case '02d': return '🌤️';
    case '02n': return '🌤️';
    case '03d': return '⛅';
    case '03n': return '⛅';
    case '04d': return '☁️';
    case '04n': return '☁️';
    case '09d': return '🌧️';
    case '09n': return '🌧️';
    case '10d': return '🌦️';
    case '10n': return '🌦️';
    case '11d': return '⛈️';
    case '11n': return '⛈️';
    case '13d': return '❄️';
    case '13n': return '❄️';
    case '50d': return '🌫️';
    case '50n': return '🌫️';
    default: return '';
  }
}


async function updateLocationAndWeather() {
  try {
    const locationResponse = await fetch('/api/location');
    if (!locationResponse.ok) {
      throw new Error(`HTTP error ${locationResponse.status}: ${locationResponse.statusText}`);
    }
    const locationData = await locationResponse.json();
    const { ip, city, location: loc, latitude: lat, longitude: lon } = locationData;

    document.getElementById('location-info').innerText = `\- IP: ${ip}\n\- ${city} ${loc.country_flag_emoji}\n\- Latitude: ${lat.toFixed(2)}\n\- Longitude: ${lon.toFixed(2)}`;

    const weatherResponse = await fetch(`/api/weather/${lat}/${lon}`);
    if (!weatherResponse.ok) {
      throw new Error(`HTTP error ${weatherResponse.status}: ${weatherResponse.statusText}`);
    }
    const weatherData = await weatherResponse.json();
    const weatherDescription = weatherData.weather[0].description;
    const weatherIcon = getWeatherEmoji(weatherData.weather[0].icon);
    document.getElementById('weather-info').innerHTML = `<span class="emoji">${weatherIcon}</span> ${weatherDescription}`;

    const englishLocationInfo = document.querySelector('#english-location-info');
    const englishWeatherInfo = document.querySelector('#english-weather-info');
    englishLocationInfo.innerText = `\- IP: ${ip}\n\- ${city} ${loc.country_flag_emoji}\n\- Latitude: ${lat.toFixed(2)}\n\- Longitude: ${lon.toFixed(2)}`;
    englishWeatherInfo.innerHTML = `<span class="emoji">${weatherIcon}</span> ${weatherDescription}`;
} catch (error) {
  console.error('Error fetching location and weather data:', error);
}}


const weatherColumn = document.getElementById('weather-column');
const COLUMN_TOGGLE_MARGIN = 50; // Number of pixels from the right edge to activate the toggle

document.addEventListener('mousemove', (event) => {
  const cursorX = event.clientX;
  const windowWidth = window.innerWidth;

  // Show the column if the cursor is within COLUMN_TOGGLE_MARGIN pixels from the right edge
  if (windowWidth - cursorX <= COLUMN_TOGGLE_MARGIN) {
    weatherColumn.style.transform = 'translateX(0)';
  } else {
    weatherColumn.style.transform = 'translateX(100%)';
  }
});


updateLocationAndWeather();

animate();