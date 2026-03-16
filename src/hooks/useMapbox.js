import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { mapPinsManager } from "../maps/mapPinsManager";

export function useMapbox(containerRef, onLongPress, navigate, user) {

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

    const mapPins = mapPinsManager(map, navigate);
    mapPinsRef.current = mapPins;


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

  useEffect(() => {

    if (!user) return;
    if (!mapPinsRef.current) return;

    mapPinsRef.current.loadPins();

  }, [user]);

  return { mapRef, mapPinsRef };

}