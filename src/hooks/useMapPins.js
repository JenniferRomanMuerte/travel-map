import mapboxgl from "mapbox-gl";
import { getPlaces } from "../services/placesService";
import { useRef } from "react";

export function useMapPins(map, navigate) {

  const markersRef = useRef([]);

  function createPin(place) {

    const marker = new mapboxgl.Marker()
      .setLngLat([place.lng, place.lat])
      .addTo(map);

    markersRef.current.push(marker);

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

  function clearPins() {

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

  }

  async function loadPins() {

    clearPins();

    const places = await getPlaces();

    places.forEach(place => {
      createPin(place);
    });

  }

  return { createPin, loadPins };

}