import { useEffect, useState } from "react";
import { getCityCountry } from "../services/geocodingService";

const TravelFormModal = ({ isOpen, onClose, onSave, coords }) => {
  const [location, setLocation] = useState(null);
  const [visitedAt, setVisitedAt] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      setLocation(null);
      setVisitedAt("");
      setNotes("");
      setFiles([]);
      setErrors({});
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !coords) return;

    async function fetchLocation() {
      try {
        const { city, country } = await getCityCountry(coords.lng, coords.lat);
        setLocation({ city, country });
      } catch (error) {
        console.error("Error obteniendo ubicación:", error);
        setLocation({
          city: "Lugar desconocido",
          country: ""
        });
      }
    }

    fetchLocation();
  }, [isOpen, coords]);

  function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};

    if (!visitedAt) {
      newErrors.visitedAt = "Debes indicar la fecha del viaje";
    }

    if (files.length === 0) {
      newErrors.files = "Debes subir al menos una foto o vídeo";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    onSave({
      visitedAt,
      notes,
      files,
      coords
    });
  }

  function handleFiles(e) {
    const newFiles = Array.from(e.target.files);

    setFiles((prevFiles) => {
      const filteredFiles = newFiles.filter((newFile) => {
        return !prevFiles.some(
          (existingFile) =>
            existingFile.name === newFile.name &&
            existingFile.size === newFile.size &&
            existingFile.lastModified === newFile.lastModified
        );
      });

      return [...prevFiles, ...filteredFiles];
    });

    setErrors((prev) => ({
      ...prev,
      files: undefined
    }));

    e.target.value = "";
  }

  function handleVisitedAtChange(e) {
    setVisitedAt(e.target.value);

    setErrors((prev) => ({
      ...prev,
      visitedAt: undefined
    }));
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  if (!isOpen) return null;

  const photosCount = files.filter((file) =>
    file.type.startsWith("image")
  ).length;

  const videosCount = files.filter((file) =>
    file.type.startsWith("video")
  ).length;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <h2 className="modal__title">Añadir viaje</h2>

        {location && (
          <p className="modal__location">
            📍 {location.city}
            {location.country ? `, ${location.country}` : ""}
          </p>
        )}

        <form className="modal__form" onSubmit={handleSubmit}>
          <label>Fecha del viaje</label>

          <input
            type="date"
            value={visitedAt}
            onChange={handleVisitedAtChange}
          />

          {errors.visitedAt && (
            <p className="form-error">{errors.visitedAt}</p>
          )}

          <label>Notas</label>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <label>Fotos / vídeos</label>

          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFiles}
          />

          {errors.files && (
            <p className="form-error">{errors.files}</p>
          )}

          {files.length > 0 && (
            <p>
              {photosCount} foto(s) y {videosCount} vídeo(s) preparados para subir
            </p>
          )}

          <div className="modal__buttons">
            <button type="submit">
              Guardar
            </button>

            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TravelFormModal;