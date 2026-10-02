import { useLocation, Link } from "react-router-dom";
import WeatherIcons from "./components/WeatherIcons";
import { useState } from "react";

export default function WeatherResults() {
  const location = useLocation();
  const weather = location.state;

  const [tempSwitch, setTempSwitch] = useState("fahrenheit");

  const convertTemp = (temp) => {
    return tempSwitch === "fahrenheit"
      ? `${((temp * 9) / 5 + 32).toFixed(0)}°F`
      : `${temp.toFixed(0)}°C`;
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 text-white px-6 py-8">
      {/* Top Navigation */}
      <header className="flex items-center justify-between">
        <Link
          to="/"
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2
                     text-sm font-medium text-white/80 backdrop-blur-md
                     transition hover:bg-white/10 hover:text-white"
        >
          ← Back to Search
        </Link>

        {/* Temperature Switch */}
        <button
          onClick={() =>
            setTempSwitch(
              tempSwitch === "fahrenheit" ? "celsius" : "fahrenheit",
            )
          }
          className="flex h-10 w-20 items-center rounded-full
                     border border-white/10 bg-black/20 p-1
                     backdrop-blur-md"
          aria-label="Switch temperature unit"
        >
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full
                        bg-white text-sm font-bold text-slate-900
                        shadow-md transition-transform duration-300
                        ${
                          tempSwitch === "fahrenheit"
                            ? "translate-x-0"
                            : "translate-x-10"
                        }`}
          >
            {tempSwitch === "fahrenheit" ? "F" : "C"}
          </div>
        </button>
      </header>

      {/* Current Weather */}
      <section className="mx-auto mt-16 max-w-4xl">
        <div
          className="rounded-3xl border border-white/10
                     bg-white/5 p-8 shadow-2xl backdrop-blur-xl
                     md:p-12"
        >
          {/* Location */}
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-white/50">
              Current Weather
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              {weather.location.name}
            </h1>

            <p className="mt-1 text-white/50">{weather.location.country}</p>
          </div>

          {/* Main Weather */}
          <div className="mt-10 flex flex-col items-center justify-center gap-8 md:flex-row">
            <div className="h-32 w-32">
              <WeatherIcons
                condition={weather.current.description}
                id={weather.current.id}
              />
            </div>

            <div className="text-center md:text-left">
              <p className="text-7xl font-light tracking-tight md:text-8xl">
                {convertTemp(weather.current.temp)}
              </p>

              <p className="mt-2 text-2xl capitalize text-white/80">
                {weather.current.description}
              </p>

              <p className="mt-2 text-sm text-white/50">
                Feels like {convertTemp(weather.current.feels_like)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Forecast */}
      <section className="mx-auto mt-12 max-w-6xl">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-white/40">
              Weather Outlook
            </p>

            <h2 className="mt-1 text-3xl font-bold">5-Day Forecast</h2>
          </div>
        </div>

        {/* Forecast Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {weather.forecast.map((day, index) => (
            <article
              key={index}
              className="rounded-2xl border border-white/10
                         bg-white/5 p-5 backdrop-blur-md
                         transition duration-300
                         hover:-translate-y-1 hover:bg-white/10"
            >
              <p className="text-sm font-medium text-white/50">{day.date}</p>

              <div className="mx-auto my-5 h-20 w-20">
                <WeatherIcons condition={day.description} id={day.id} />
              </div>

              <p className="text-center text-lg font-medium capitalize">
                {day.description}
              </p>

              <div className="mt-5 border-t border-white/10 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/50">Low</span>

                  <span className="font-semibold">
                    {convertTemp(day.tempMin)}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-white/50">High</span>

                  <span className="font-semibold">
                    {convertTemp(day.tempMax)}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
