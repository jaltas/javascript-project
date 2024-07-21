const Key = 'c4e81d41faa0114df129f2772c8472d5';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';
async function getWeather(city) {
    try {
        const response = await fetch(`${apiUrl}?q=${city}&appid=${Key}`);
        if (!response.ok) throw new Error('City not found');
        const data = await response.json();
        return data;
    } catch (error) {
        alert(error.message);
    }
}
async function getExtendedForecast(city) {
    try {
        const response = await fetch(`${forecastUrl}?q=${city}&appid=${Key}`);
        if (!response.ok) throw new Error('City not found');
        const data = await response.json();
        return data;
    } catch (error) {
        alert(error.message);
    }
}

document.getElementById('searchBtn').addEventListener('click', async () => {
    const city = document.getElementById('cityInput').value;
    const weatherData = await getWeather(city);
    displayWeather(weatherData);
    const forecastData = await getExtendedForecast(city);
    displayExtendedForecast(forecastData);
});

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const response = await fetch(`${apiUrl}?lat=${lat}&lon=${lon}&appid=${Key}`);
        const data = await response.json();
        displayWeather(data);
    });
}

function displayWeather(data) {
    const weatherDisplay = document.getElementById('weatherDisplay');
    weatherDisplay.innerHTML = `
        <h2>${data.name}</h2>
        <p>Temperature: ${(data.main.temp - 273.15).toFixed(2)} °C</p>
        <p>Humidity: ${data.main.humidity} %</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
        <p>Condition: ${data.weather[0].description}</p>
    `;
}

function displayExtendedForecast(data) {
    const forecastDisplay = document.getElementById('forecastDisplay');
    forecastDisplay.innerHTML = data.list.map(day => `
        <div>
            <h3>${day.dt_txt}</h3>
            <img src="assets/icons/${day.weather[0].icon}.png" alt="${day.weather[0].description}">
            <p>Temp: ${(day.main.temp - 273.15).toFixed(2)} °C</p>
            <p>Wind: ${day.wind.speed} km/s</p>
            <p>Humidity: ${day.main.humidity} %</p>
        </div>
    `).join('');
}