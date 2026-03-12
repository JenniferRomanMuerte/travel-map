import mapboxgl from "mapbox-gl";
import { getPlaces } from "../services/placesService";

export function useMapPins(map) {

  function createPin(place) {

    const marker = new mapboxgl.Marker()
      .setLngLat([place.lng, place.lat])
      .addTo(map);

    const popup = new mapboxgl.Popup({ offset: 25 })
      .setText(
        `${place.city || "Lugar"}, ${place.country || ""}`
      );

    marker.setPopup(popup);

  }

  async function loadPins() {

    const places = await getPlaces();

    places.forEach(place => {
      createPin(place);
    });

  }

  return { createPin, loadPins };

}