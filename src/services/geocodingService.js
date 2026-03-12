export async function getCityCountry(lng, lat) {

  const token = import.meta.env.VITE_MAPBOX_TOKEN;

  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=place&access_token=${token}`
  );

  const data = await response.json();

  let city = "Lugar desconocido";
  let country = "Desconocido";

  if (data.features && data.features.length > 0) {

    city = data.features[0].text;

    const countryContext = data.features[0].context?.find(c =>
      c.id.includes("country")
    );

    if (countryContext) {
      country = countryContext.text;
    }

  }

  return { city, country };

}