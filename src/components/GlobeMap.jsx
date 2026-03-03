import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const GlobeMap = () => {
  const mapContainer = useRef(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      projection: "globe",
      zoom: 0.8,
      center: [0, 20],
      antialias: true,
    });

    map.on("style.load", () => {
      map.setFog({
        color: "rgb(186, 210, 235)",
        "high-color": "rgb(36, 92, 223)",
        "horizon-blend": 0.02,
      });
    });

    return () => map.remove();
  }, []);

  return (
    <div
      ref={mapContainer}
      className="globe-map"
    />
  );
};

export default GlobeMap;
