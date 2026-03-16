import mapboxgl from "mapbox-gl";
import { getPlaces } from "../services/placesService";

export function mapPinsManager(map, navigate) {
  const markers = [];

  function createPin(place) {
    const marker = new mapboxgl.Marker()
      .setLngLat([place.lng, place.lat])
      .addTo(map);

    markers.push(marker);

    const popup = new mapboxgl.Popup({
      offset: 25,
      closeButton: false,
      closeOnClick: false
    }).setText(`${place.city || "Lugar"}, ${place.country || ""}`);

    const el = marker.getElement();

    el.addEventListener("mouseenter", () => {
      popup.setLngLat([place.lng, place.lat]).addTo(map);
    });

    el.addEventListener("mouseleave", () => {
      popup.remove();
    });

    el.addEventListener("click", (e) => {
      e.stopPropagation();
      navigate(`/place/${place.id}`);
    });
  }

  function clearPins() {
    markers.forEach(marker => marker.remove());
    markers.length = 0;
  }

  async function loadPins(userId) {
    clearPins();

    const places = await getPlaces(userId);

    places.forEach(place => {
      createPin(place);
    });
  }

  return { createPin, loadPins, clearPins };
}