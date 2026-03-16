import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { mapPinsManager } from "../maps/mapPinsManager";

export function useMapbox(containerRef, onLongPress, navigate, user) {
  const mapRef = useRef(null);
  const mapPinsRef = useRef(null);
  const isMapLoadedRef = useRef(false);
  const userRef = useRef(user);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return;

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

    map.on("load", async () => {
      isMapLoadedRef.current = true;

      if (userRef.current?.id && mapPinsRef.current) {
        await mapPinsRef.current.loadPins(userRef.current.id);
      }
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

    return () => {
      map.remove();
      mapRef.current = null;
      mapPinsRef.current = null;
      isMapLoadedRef.current = false;
    };
  }, [containerRef, navigate, onLongPress]);

  useEffect(() => {
    if (!mapPinsRef.current) return;
    if (!isMapLoadedRef.current) return;

    if (user?.id) {
      mapPinsRef.current.loadPins(user.id);
    } else {
      mapPinsRef.current.clearPins();
    }
  }, [user]);

  return { mapRef, mapPinsRef };
}