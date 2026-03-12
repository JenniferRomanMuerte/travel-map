import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { useMapPins } from "./useMapPins";

export function useMapbox(containerRef, onLongPress) {

  const mapRef = useRef(null);
  const mapPinsRef = useRef(null);

  useEffect(() => {

    if (!containerRef.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      projection: "globe",
      zoom: 0.8,
      center: [0, 20],
      antialias: true
    });

    mapRef.current = map;

    const mapPins = useMapPins(map);
    mapPinsRef.current = mapPins;

    map.on("load", () => {
      mapPins.loadPins();
    });

    map.on("contextmenu", (e) => {
      onLongPress(e.lngLat);
    });

    let pressTimer;

    map.on("touchstart", (e) => {

      pressTimer = setTimeout(() => {
        onLongPress(e.lngLat);
      }, 600);

    });

    map.on("touchend", () => clearTimeout(pressTimer));

    return () => map.remove();

  }, []);

  return { mapRef, mapPinsRef };

}