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
      style: "mapbox://styles/mapbox/outdoors-v12",
      projection: "globe",
      zoom: 0.8,
      center: [0, 20],
      antialias: true,
    });



    map.on("style.load", () => {

      // Quitar carreteras
      const layers = map.getStyle().layers;

      console.log(
        layers
          .filter(l => l.id.includes("boundary") || l.id.includes("admin"))
          .map(l => ({ id: l.id, type: l.type }))
      );

      layers.forEach(layer => {
        if (layer.id.includes("road")) {
          map.setLayoutProperty(layer.id, "visibility", "none");
        }
      });

      // Hacer océano más vibrante
      layers.forEach(layer => {
        if (layer.id.includes("water")) {
          map.setPaintProperty(layer.id, "fill-color", "#157eff");
        }
      });


      // Saturar Verdes
      layers.forEach(layer => {
        if (layer.id.includes("land")) {
          map.setPaintProperty(layer.id, "fill-color", "#458435");
        }
      });

      // Oscurecer zonas áridas / beige
      layers.forEach(layer => {
        if (
          layer.id.includes("landuse") ||
          layer.id.includes("landcover")
        ) {
          map.setPaintProperty(layer.id, "fill-color", "#d2c093");
        }
      });


      //Menos relieve
      layers.forEach(layer => {
        if (layer.id.includes("hillshade")) {
          map.setLayoutProperty(layer.id, "visibility", "none");
        }
      });

      map.setFog({
        color: "rgb(80, 130, 210)",
        "high-color": "rgb(40, 90, 180)",
        "horizon-blend": 0.02,
        "space-color": "rgb(5, 15, 50)"
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
