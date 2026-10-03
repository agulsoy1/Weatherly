import http from "http";
//allows backend to make HTTP requests to external servers/APIs
import weatherHandler from "./weatherHandler.js";
// imports the weatherHandler function to handle weather-related API requests

const API_KEY = process.env.OPENWEATHER_API_KEY;
// retrieves the environment variable for the OpenWeather API key

const PORT = 3000;
// gives server port number to listen on so clients can access our backend at localhost:3000

const BASE_URL = "https://api.openweathermap.org/data/2.5";
//Gives us a reusable base url to use when making requests to the OpenWeather API

const server = http.createServer(weatherHandler);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
