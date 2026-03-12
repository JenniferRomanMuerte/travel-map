import mapboxgl from "mapbox-gl";
import { getPlaces } from "../services/placesService";

export function useMapPins(map, navigate) {

  function createPin(place) {

    const marker = new mapboxgl.Marker()
      .setLngLat([place.lng, place.lat])
      .addTo(map);

    const popup = new mapboxgl.Popup({
      offset: 25,
      closeButton: false,
      closeOnClick: false
    }).setText(
      `${place.city || "Lugar"}, ${place.country || ""}`
    );

    const el = marker.getElement();

    // mostrar popup al pasar el ratón
    el.addEventListener("mouseenter", () => {
      popup.setLngLat([place.lng, place.lat]).addTo(map);
    });

    // ocultar popup al salir
    el.addEventListener("mouseleave", () => {
      popup.remove();
    });

    // click → abrir página
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      navigate(`/place/${place.id}`);
    });

  }

  async function loadPins() {

    const places = await getPlaces();

    places.forEach(place => {
      createPin(place);
    });

  }

  return { createPin, loadPins };

}