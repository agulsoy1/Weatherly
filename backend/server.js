import http from "http";
// Http allows us to create an http server
import axios from "axios";
//allows backend to make HTTP requests to external servers/APIs
import dotenv from "dotenv";
// dotenv allows us to load and retrieve environment variables
import url from "url";
// url allows us to parse incoming URLs into a base path and its query parameters

dotenv.config();
// load environment variables

const API_KEY = process.env.OPENWEATHER_API_KEY;
// retrieves the environment variable for the OpenWeather API key

const PORT = 3000;
// gives server port number to listen on so clients can access our backend at localhost:3000

const BASE_URL = "https://api.openweathermap.org/data/2.5";
//Gives us a reusable base url to use when making requests to the OpenWeather API

function sendJSON(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  return res.end(JSON.stringify(data));
}

function buildWeatherResponse(current, forecast) {
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

function buildDailyForecast(list) {
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

async function getWeatherData(params) {
  const [weatherRes, forecastRes] = await Promise.all([
    axios.get(`${BASE_URL}/weather?${params}&appid=${API_KEY}`),
    axios.get(`${BASE_URL}/forecast?${params}&appid=${API_KEY}`),
  ]);

  return buildWeatherResponse(weatherRes.data, forecastRes.data);
}

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  const path = parsed.pathname;
  const query = parsed.query;

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    return res.end();
  }

  if (path === "/api/weather/coords") {
    const lat = query.lat;
    const lon = query.lon;
    const units = query.units || "metric";

    if (!lat || !lon) {
      return sendJSON(res, 400, {
        error: "latitude and longitude are required",
      });
    }

    try {
      const data = await getWeatherData(`lat=${lat}&lon=${lon}&units=${units}`);
      return sendJSON(res, 200, data);
    } catch (error) {
      const status = error.response?.status;
      console.log("Weather coords error: ", status);
      if (status === 400) {
        return sendJSON(res, 400, { error: "Invalid coordinates" });
      }
      return sendJSON(res, 500, { error: "Unable to retrieve weather data" });
    }
  }

  if (path === "/api/weather") {
    const city = query.city;
    const units = query.units || "metric";

    if (!city) {
      return sendJSON(res, 400, { error: "City is required" });
    }
    try {
      const data = await getWeatherData(`q=${city}&units=${units}`);
      return sendJSON(res, 200, data);
    } catch (error) {
      const status = error.response?.status;
      console.log("Weather city error: ", error.response?.data);
      if (status === 404) {
        return sendJSON(res, 404, { error: "City not found" });
      }
      return sendJSON(res, 500, { error: "Weather lookup failed" });
    }
  }
  return sendJSON(res, 404, { error: "Endpoint not found" });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
