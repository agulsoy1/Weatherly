import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = process.env.OPENWEATHER_API_KEY;

export function buildWeatherResponse(current, forecast) {
  return {
    location: {
      name: current.name,
      country: current.sys.country,
    },
    current: {
      temp: current.main.temp,
      feels_like: current.main.feels_like,
      description: current.weather[0].description,
      icon: current.weather[0].icon,
      humidity: current.main.humidity,
      windSpeed: current.wind.speed,
      id: current.weather[0].id,
    },
    forecast: buildDailyForecast(forecast.list),
  };
}

export function buildDailyForecast(list) {
  const byDate = {};
  list.forEach((item) => {
    const date = item.dt_txt.split(` `)[0];
    if (!byDate[date]) byDate[date] = [];
    byDate[date].push(item);
  });
  return Object.keys(byDate)
    .slice(0, 5)
    .map((date) => {
      const items = byDate[date];
      const midItem = items[Math.floor(items.length / 2)];
      return {
        date,
        tempMin: Math.min(...items.map((item) => item.main.temp)),
        tempMax: Math.max(...items.map((item) => item.main.temp)),
        temp: midItem.main.temp,
        description: midItem.weather[0].description,
        icon: midItem.weather[0].icon,
        id: midItem.weather[0].id,
      };
    });
}

export async function getWeatherData(params) {
  const [weatherRes, forecastRes] = await Promise.all([
    axios.get(`${BASE_URL}/weather?${params}&appid=${API_KEY}`),
    axios.get(`${BASE_URL}/forecast?${params}&appid=${API_KEY}`),
  ]);

  return buildWeatherResponse(weatherRes.data, forecastRes.data);
}
