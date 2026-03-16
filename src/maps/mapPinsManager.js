import mapboxgl from "mapbox-gl";
import { getPlaces } from "../services/placesService";

export function mapPinsManager(map, navigate) {
  const pins = [];

  function createPin(place) {
    if (
      typeof place?.lat !== "number" ||
      typeof place?.lng !== "number"
    ) {
      return;
    }

    const marker = new mapboxgl.Marker()
      .setLngLat([place.lng, place.lat])
      .addTo(map);

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

    pins.push({ marker, popup });
  }

  function clearPins() {
    pins.forEach(({ marker, popup }) => {
      popup.remove();
      marker.remove();
    });

    pins.length = 0;
  }

  async function loadPins(userId) {
    try {
      clearPins();

      const places = await getPlaces(userId);

      places.forEach(place => {
        createPin(place);
      });
    } catch (error) {
      console.error("Error cargando pins:", error);
    }
  }

  return { createPin, loadPins, clearPins };
}