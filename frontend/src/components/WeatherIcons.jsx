const weatherIcons = {
  sun: "/assets/sun_icon.png",
  cloud: "/assets/cloudy_icon.png",
  snow: "/assets/snow_icon.png",
  rain: "/assets/rain_icon.png",
  thunderstorm: "/assets/thunder_icon.png",
  atmosphere: "/assets/mist_icon.png",
  drizzle: "/assets/drizzle_icon.png",
};
export default function WeatherIcons({ condition, id }) {
  const icon = getWeatherIconById(id);

  return <img src={icon} alt={condition} width="150" height="100" />;
}

function getWeatherIconById(id) {
  if (id >= 200 && id <= 232) {
    return weatherIcons.thunderstorm;
  }
  if (id >= 300 && id <= 321) {
    return weatherIcons.drizzle;
  }
  if (id >= 500 && id <= 531) {
    return weatherIcons.rain;
  }
  if (id >= 600 && id <= 622) {
    return weatherIcons.snow;
  }
  if (id >= 700 && id <= 781) {
    return weatherIcons.atmosphere;
  }
  if (id === 800) {
    return weatherIcons.sun;
  }
  if (id >= 801 && id <= 804) {
    return weatherIcons.cloud;
  }
  return weatherIcons.sun;
}
