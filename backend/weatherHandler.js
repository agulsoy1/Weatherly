import url from "url";
import { getWeatherData } from "./weatherServices.js";
import { sendJSON } from "./utils/sendJSON.js";

export default async function weatherHandler(req, res) {
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
}
