export function getCurrentWeather({ city, lat, long }) {
  const weather = {
    temperature: 37,
  };
  const location = city ?? `${lat} ${long}`;
  console.log(`Current weather in ${location}: ${weather.temperature} °C`);
}
