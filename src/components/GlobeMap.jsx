import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { useMapPins } from "../hooks/useMapPins";
import "mapbox-gl/dist/mapbox-gl.css";

const GlobeMap = () => {

  const mapContainer = useRef(null);

  useEffect(() => {

    if (!mapContainer.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      projection: "globe",
      zoom: 0.8,
      center: [0, 20],
      antialias: true,
    });

    const { createPin, loadPins  } = useMapPins(map);

    // cargar pins guardados cuando el mapa esté listo
    map.on("load", () => {
      loadPins();
    });

    // click derecho en ordenador
    map.on("contextmenu", (e) => {

      const { lng, lat } = e.lngLat;
      createPin(lng, lat);

    });

    // pulsación larga en móvil
    let pressTimer;

    map.on("touchstart", (e) => {

      pressTimer = setTimeout(() => {

        const { lng, lat } = e.lngLat;
        createPin(lng, lat);

      }, 600);

    });

    map.on("touchend", () => {
      clearTimeout(pressTimer);
    });

    return () => map.remove();

  }, []);

  return <div ref={mapContainer} className="globe-map" />;

};

export default GlobeMap;