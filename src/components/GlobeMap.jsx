import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMapbox } from "../hooks/useMapbox";
import { saveTravel } from "../travel/saveTravel";
import { useAuth } from "../context/AuthContext";
import TravelFormModal from "./TravelFormModal";
import ProcessModal from "./ProcessModal";
import "mapbox-gl/dist/mapbox-gl.css";

const GlobeMap = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const mapContainer = useRef(null);
  const successTimeoutRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState(null);

  const [processModal, setProcessModal] = useState({
    isOpen: false,
    message: "",
    type: "loading"
  });

  function handleLongPress(lngLat) {
    setSelectedCoords(lngLat);
    setIsModalOpen(true);
  }

  const { mapPinsRef } = useMapbox(
    mapContainer,
    handleLongPress,
    navigate,
    user
  );

  function closeProcessModal() {
    setProcessModal((prev) => ({ ...prev, isOpen: false }));
  }

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  async function handleSaveTravel(data) {
    try {
      const place = await saveTravel(data, setProcessModal);

      if (mapPinsRef.current && place) {
        mapPinsRef.current.createPin(place);
      }

      setIsModalOpen(false);

      setProcessModal({
        isOpen: true,
        message: "Viaje guardado correctamente",
        type: "success"
      });

      successTimeoutRef.current = setTimeout(() => {
        closeProcessModal();
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
        onClose={closeProcessModal}
      />
    </>
  );
};

export default GlobeMap;