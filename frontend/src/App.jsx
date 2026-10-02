"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function App() {
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  function resetState() {
    setLoading(true);
    setError(null);
    setWeather(null);
  }

  async function getWeatherByCity() {
    if (!city.trim()) {
      setError("Please enter a city.");
      return;
    }

    resetState();

    try {
      const res = await fetch(
        `http://localhost:3000/api/weather?city=${encodeURIComponent(city)}`
      );

      const data = await res.json();

      if (res.status !== 200) {
        throw new Error(data.error || "Unable to find weather data.");
      }

      setWeather(data);
      navigate("/WeatherResults", { state: data });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function getWeatherByCoords() {
    if (!latitude || !longitude) {
      setError("Please enter both latitude and longitude.");
      return;
    }

    resetState();

    try {
      const res = await fetch(
        `http://localhost:3000/api/weather/coords?lat=${encodeURIComponent(
          latitude
        )}&lon=${encodeURIComponent(longitude)}`
      );

      const data = await res.json();

      if (res.status !== 200) {
        throw new Error(data.error || "Unable to find weather data.");
      }

      setWeather(data);
      navigate("/WeatherResults", { state: data });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit() {
    if (city.trim()) {
      getWeatherByCity();
    } else if (latitude && longitude) {
      getWeatherByCoords();
    } else {
      setError("Please enter a city or both coordinates.");
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden text-white">

      {/* Background */}
      <img
        src="/assets/sky_background.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-12">

        {/* Logo / Title */}
        <div className="mb-10 text-center">

          <p className="mb-3 text-sm font-medium uppercase tracking-[0.4em] text-white/70">
            Your personal weather companion
          </p>

          <h1 className="fascinate-inline text-6xl font-bold tracking-wide drop-shadow-lg md:text-8xl">
            Weatherly
          </h1>

          <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-white/90 md:text-xl">
            Discover the weather anywhere in the world.
          </p>

        </div>

        {/* Search Card */}
        <div
          className="w-full max-w-lg rounded-3xl border border-white/20
                     bg-white/10 p-6 shadow-2xl backdrop-blur-xl
                     md:p-8"
        >

          {/* City Search */}
          <div>
            <label
              htmlFor="city"
              className="mb-3 block text-sm font-medium uppercase
                         tracking-wider text-white/70"
            >
              Search by city
            </label>

            <input
              id="city"
              type="text"
              placeholder="Enter a city..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  getWeatherByCity();
                }
              }}
              className="w-full rounded-xl border border-white/20
                         bg-white/10 px-4 py-3 text-white
                         placeholder:text-white/40
                         outline-none backdrop-blur-md
                         transition
                         focus:border-white/50 focus:bg-white/15
                         focus:ring-2 focus:ring-white/20"
            />
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/15" />

            <span className="text-xs font-medium uppercase tracking-widest text-white/40">
              or
            </span>

            <div className="h-px flex-1 bg-white/15" />
          </div>

          {/* Coordinates */}
          <div>

            <label className="mb-3 block text-sm font-medium uppercase tracking-wider text-white/70">
              Search by coordinates
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

              <input
                type="number"
                placeholder="Latitude"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="w-full rounded-xl border border-white/20
                           bg-white/10 px-4 py-3 text-white
                           placeholder:text-white/40
                           outline-none backdrop-blur-md
                           transition
                           focus:border-white/50 focus:bg-white/15
                           focus:ring-2 focus:ring-white/20"
              />

              <input
                type="number"
                placeholder="Longitude"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    getWeatherByCoords();
                  }
                }}
                className="w-full rounded-xl border border-white/20
                           bg-white/10 px-4 py-3 text-white
                           placeholder:text-white/40
                           outline-none backdrop-blur-md
                           transition
                           focus:border-white/50 focus:bg-white/15
                           focus:ring-2 focus:ring-white/20"
              />

            </div>

            <p className="mt-2 text-xs text-white/40">
              Example: 51.5074, -0.1276
            </p>

          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-7 w-full rounded-xl bg-white px-5 py-3.5
                       text-sm font-bold text-slate-900
                       shadow-lg transition
                       hover:-translate-y-0.5 hover:bg-white/90
                       active:translate-y-0
                       disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Finding Weather..." : "Get Weather"}
          </button>

          {/* Loading */}
          {loading && (
            <p className="mt-4 text-center text-sm text-white/60">
              Looking up the latest weather...
            </p>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 rounded-xl border border-red-300/20
                            bg-red-500/10 px-4 py-3 text-center
                            text-sm text-red-200">
              {error}
            </div>
          )}

        </div>

        {/* Footer */}
        <p className="mt-8 text-xs tracking-wide text-white/40">
          Weather data powered by OpenWeather
        </p>

      </div>
    </main>
  );
}