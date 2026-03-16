export async function getCityCountry(lng, lat) {
  const token = import.meta.env.VITE_MAPBOX_TOKEN;

  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=place&access_token=${token}`
  );

  if (!response.ok) {
    throw new Error(`Error en geocoding: ${response.status}`);
  }

  const data = await response.json();

  const firstFeature = data?.features?.[0];

  if (!firstFeature) {
    return {
      city: "Lugar desconocido",
      country: "Desconocido"
    };
  }

  const city = firstFeature.text || "Lugar desconocido";

  const countryContext = firstFeature.context?.find((item) =>
    item.id.includes("country")
  );

  const country = countryContext?.text || "Desconocido";

  return { city, country };
}