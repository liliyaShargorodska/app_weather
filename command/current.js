export function getCurrentWeather({ city, lat, long }) {
  validate({ city, lat, long });
  const weather = {
    temperature: 37,
  };
  const location = city ?? `${lat} ${long}`;
  console.log(`Current weather in ${location}: ${weather.temperature} °C`);
}
export function validate({ city, lat, long }) {
  if (!city && !(lat && long)) {
    throw new Error("Either city or lat and long should be present");
  }

  if (city && city.length < 2) {
    throw new Error("City name should be longer than 2 characters");
  }

  if (lat && !isNumberStringWithBoundaries(lat, -90, 90)) {
    throw new Error("Latitude should be a number between -90 and 90");
  }

  if (long && !isNumberStringWithBoundaries(long, -180, 180)) {
    throw new Error("Longitude should be a number between -180 and 180");
  }
}

function isNumberStringWithBoundaries(numStr, min, max) {
  const value = Number.parseFloat(numStr);
  if (Number.isNaN(value)) {
    return false;
  }
  return value >= min && value <= max;
}
