'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [weatherCondition, setWeatherCondition] = useState('');
  
  const predefinedCity = 'London';

  const fetchCityWeather = (city) => {
    console.log('Fetching weather for city:', city);

    const encodedCity = encodeURIComponent(city);

    fetch(`https://geocode.maps.co/search?q=${encodedCity}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length === 0) {
          alert('City not found. Please check the city name.');
          return;
        }

        const latitude = data[0].lat;
        const longitude = data[0].lon;
        console.log('Latitude:', latitude, 'Longitude:', longitude);

        fetchWeather(latitude, longitude);
      })
      .catch((error) => {
        console.error('Error fetching city data:', error);
        alert('An error occurred while fetching city data.');
      });
  };

  const fetchWeather = (latitude, longitude) => {
    console.log('Fetching weather for coordinates:', latitude, longitude);
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.current_weather) {
          const weatherCode = data.current_weather.weathercode; // Weather condition code
          const condition = mapWeatherCondition(weatherCode);
          setWeatherCondition(condition);
        } else {
          alert('Unable to fetch weather data.');
        }
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
        alert('An error occurred while fetching weather data.');
      });
  };

  const mapWeatherCondition = (code) => {
    const weatherConditions = {
      0: 'clear',
      1: 'partly_cloudy',
      2: 'cloudy',
      3: 'overcast',
      45: 'foggy',
      48: 'foggy',
      51: 'light_rain',
      53: 'moderate_rain',
      55: 'heavy_rain',
      56: 'light_snow',
      57: 'moderate_snow',
      61: 'light_rain_showers',
      63: 'moderate_rain_showers',
      65: 'heavy_rain_showers',
      66: 'light_freezing_rain',
      67: 'heavy_freezing_rain',
      71: 'light_snow_showers',
      73: 'moderate_snow_showers',
      75: 'heavy_snow_showers',
      77: 'small_hail',
      80: 'light_thunderstorms',
      81: 'moderate_thunderstorms',
      82: 'heavy_thunderstorms',
    };
    return weatherConditions[code] || 'clear'; // Default to 'clear' if no match
  };

  const changeBackgroundVideo = (weatherCondition) => {
    const video = document.getElementById('background-video');
    if (weatherCondition.includes('rain')) {
      video.src = 'assets/rainy.mp4'; // Path to rainy video
    } else if (weatherCondition.includes('snow')) {
      video.src = 'assets/snowy.mp4'; // Path to snowy video
    } else {
      video.src = 'assets/sunny.mp4'; // Path to sunny video
    }
  };

  useEffect(() => {
    fetchCityWeather(predefinedCity); // Fetch weather when the component mounts
  }, []);

  useEffect(() => {
    changeBackgroundVideo(weatherCondition); // Change the background video when the weather condition changes
  }, [weatherCondition]);

  return (
    <main className={styles.main}>
      {/* Video Background */}
      <video autoPlay muted loop id="background-video" className={styles.backgroundVideo}>
        <source src="assets/sunny.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Login Form Container */}
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="login-container bg-light p-4 rounded shadow-sm">
          <h2 className="text-center" style={{ color: 'black' }}>Sign In</h2>
          <form id="loginForm">
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                placeholder="Enter your username"
                required
                autoComplete="off"
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Enter your password"
                required
              />
            </div>
            {/* Add space between password field and the button */}
            <div className="mb-3"></div> {/* You can adjust the size by changing the margin-bottom value */}
            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              style={{ marginTop: '50px', width: '100%' }} // Ensure full width for button and spacing
            >
              Continue
            </button>
          </form>
          <p id="error-message" className="text-danger mt-3"></p>
        </div>
      </div>
    </main>
  );
}
