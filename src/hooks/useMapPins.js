import mapboxgl from "mapbox-gl";
import { createPlace, getPlaces } from "../services/placesService";

export function useMapPins(map) {

  async function createPin(lng, lat) {

    const marker = new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .addTo(map);

    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=place&access_token=${mapboxgl.accessToken}`
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

    const popup = new mapboxgl.Popup({ offset: 25 })
      .setText(`${city}, ${country}`);

    marker.setPopup(popup);
    popup.addTo(map);

    await createPlace({
      city,
      country,
      lat,
      lng
    });
  }

  async function loadPins() {

    const places = await getPlaces();

    places.forEach(place => {

      const marker = new mapboxgl.Marker()
        .setLngLat([place.lng, place.lat])
        .addTo(map);

      const popup = new mapboxgl.Popup({ offset: 25 })
        .setText(`${place.city}, ${place.country}`);

      marker.setPopup(popup);

    });

  }
  return { createPin, loadPins};
}