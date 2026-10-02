// Import Node's HTTP server utilities.
import http from "http";
// Import Axios for making requests to the OpenWeather API.
import axios from "axios";
// Import dotenv for loading environment variables from a .env file.
import dotenv from "dotenv";
// Import URL helpers for parsing request paths and query parameters.
import url from "url";

// Load environment variables from the project's .env file.
dotenv.config();

// Read the OpenWeather API key from the environment.
const API_KEY = process.env.OPENWEATHER_API_KEY;
// Define the local port used by the backend server.
const PORT = 3000;

// Define the shared base URL for OpenWeather endpoints.
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// Send a JSON response with status and CORS headers.
function sendJSON(res, status, data) {
  // Set response metadata so browsers can read the API response.
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  // Serialize the response object and finish the request.
  res.end(JSON.stringify(data));
}

// Group forecast entries by date and create five daily summaries.
function buildDailyForecast(list) {
  // Store forecast entries under their calendar date.
  const byDate = {};

  // Process each three-hour forecast entry.
  list.forEach((entry) => {
    // Extract the calendar date from the API timestamp.
    const date = entry.dt_txt.split(" ")[0];
    // Create a collection for this date when needed.
    if (!byDate[date]) byDate[date] = [];
    // Add the forecast entry to its date collection.
    byDate[date].push(entry);
  });

  // Convert grouped entries into a maximum of five daily summaries.
  return Object.keys(byDate)
    .slice(0, 5)
    .map((date) => {
      // Retrieve all forecast entries for the current date.
      const items = byDate[date];
      // Select a middle entry to represent the day's weather description and icon.
      const mid = items[Math.floor(items.length / 2)];
      return {
        // Include the date and calculated daily weather details.
        date,
        // Find the lowest temperature in the day's entries.
        tempMin: Math.min(...items.map((i) => i.main.temp)),
        // Find the highest temperature in the day's entries.
        tempMax: Math.max(...items.map((i) => i.main.temp)),
        // Include the representative weather description.
        description: mid.weather[0].description,
        // Include the representative weather icon code.
        icon: mid.weather[0].icon,
      };
    });
}

// Combine current conditions and forecast data into the frontend response shape.
function buildWeatherResponse(current, forecast) {
  return {
    location: {
      // Include the resolved city name.
      name: current.name,
      // Include the resolved country code.
      country: current.sys.country,
    },
    current: {
      // Map the current temperature details.
      temp: current.main.temp,
      feels_like: current.main.feels_like,
      description: current.weather[0].description,
      icon: current.weather[0].icon,
      humidity: current.main.humidity,
      windSpeed: current.wind.speed,
    },
    // Add the normalized five-day forecast.
    forecast: buildDailyForecast(forecast.list),
  };
}

// Create the HTTP server and handle incoming API requests.
const server = http.createServer(async (req, res) => {
  // Complete CORS preflight requests without contacting the weather API.
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    return res.end();
  }

  // Parse the requested path and query string.
  const parsed = url.parse(req.url, true);
  const path = parsed.pathname;
  const query = parsed.query;

  // Handle weather lookups by city name.
  if (path === "/api/weather") {
    // Read the requested city and measurement units.
    const city = query.city;
    const units = query.units || "metric";

    // Reject requests that do not specify a city.
    if (!city) {
      return sendJSON(res, 400, { error: "City is required" });
    }

    try {
      // Request current conditions and forecast data concurrently.
      const [currentRes, forecastRes] = await Promise.all([
        axios.get(
          `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=${units}`,
        ),
        axios.get(
          `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=${units}`,
        ),
      ]);

      // Normalize both API responses for the frontend.
      const data = buildWeatherResponse(currentRes.data, forecastRes.data);
      return sendJSON(res, 200, data);
    } catch (error) {
      // Log the provider error while returning a safe client message.
      console.log("Weather city error: ", error.response?.data);
      return sendJSON(res, 500, { error: "Weather lookup failed" });
    }
  }

  // Handle weather lookups by geographic coordinates.
  if (path === "/api/weather/coords") {
    // Read coordinates and use metric units by default.
    const { lat, lon, units = "metric" } = query;

    // Reject requests missing either coordinate.
    if (!lat || !lon) {
      return sendJSON(res, 400, {
        error: "Latitude and longitude are required",
      });
    }

    try {
      // Request current conditions and forecast data concurrently.
      const [currentRes, forecastRes] = await Promise.all([
        axios.get(
          `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`,
        ),
        axios.get(
          `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`,
        ),
      ]);

      // Normalize both API responses for the frontend.
      const data = buildWeatherResponse(currentRes.data, forecastRes.data);
      return sendJSON(res, 200, data);
    } catch (error) {
      // Log the provider error while returning a safe client message.
      console.log("Weather coordinates error: ", error.response?.data);
      return sendJSON(res, 500, { error: "Weather lookup failed" });
    }
  }

  // Return a not-found response for unsupported routes.
  sendJSON(res, 404, { error: "Not found" });
});

// Start listening for requests on the configured local port.
server.listen(PORT, () => {
  // Confirm the server address in the console.
  console.log(`Weather server running at http://localhost:${PORT}`);
});