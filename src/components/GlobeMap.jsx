import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMapbox } from "../hooks/useMapbox";
import { saveTravel } from "../hooks/useTravelSave";
import TravelFormModal from "../components/TravelFormModal";
import ProcessModal from "../components/ProcessModal";
import "mapbox-gl/dist/mapbox-gl.css";

const GlobeMap = () => {

  const navigate = useNavigate();

  const mapContainer = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState(null);

  const [processModal, setProcessModal] = useState({
    isOpen: false,
    message: "",
    type: "loading"
  });

  // hook que inicializa mapbox y devuelve acceso a los pins
  const { mapPinsRef } = useMapbox(
    mapContainer,
    (lngLat) => {
      setSelectedCoords(lngLat);
      setIsModalOpen(true);
    },
    navigate
  );

  // ------------------------------------------------
  // GUARDAR VIAJE
  // ------------------------------------------------

  async function handleSaveTravel(data) {

    try {

      const place = await saveTravel(data, setProcessModal);

      // crear pin directamente (más eficiente que recargar todos)
      if (mapPinsRef.current && place) {
        mapPinsRef.current.createPin(place);
      }

      setIsModalOpen(false);

      setProcessModal({
        isOpen: true,
        message: "Viaje guardado correctamente",
        type: "success"
      });

      // cerrar modal automáticamente
      setTimeout(() => {
        setProcessModal(prev => ({ ...prev, isOpen: false }));
      }, 2000);

    } catch (error) {

      console.error(error);

      setProcessModal({
        isOpen: true,
        message: "No se pudo guardar el viaje",
        type: "error"
      });

    }

  }

  // ------------------------------------------------
  // RENDER
  // ------------------------------------------------

  return (
    <>
      <div ref={mapContainer} className="globe-map" />

      <TravelFormModal
        isOpen={isModalOpen}
        coords={selectedCoords}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTravel}
      />

      <ProcessModal
        isOpen={processModal.isOpen}
        message={processModal.message}
        type={processModal.type}
        onClose={() =>
          setProcessModal(prev => ({ ...prev, isOpen: false }))
        }
      />
    </>
  );

};

export default GlobeMap;