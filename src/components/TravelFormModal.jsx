import { useEffect, useState } from "react";
import { getCityCountry } from "../services/geocodingService";

const TravelFormModal = ({
  isOpen,
  onClose,
  onSave,
  coords,
  mode = "create",
  initialData = null,
  isSaving = false,
  uploadProgress = 0
}) => {
  const [location, setLocation] = useState(null);
  const [visitedAt, setVisitedAt] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return;

    setErrors({});
    setFiles([]);

    if (mode === "edit" && initialData) {
      setVisitedAt(
        initialData.visited_at
          ? new Date(initialData.visited_at).toISOString().split("T")[0]
          : ""
      );
      setNotes(initialData.notes || "");
      setLocation({
        city: initialData.city || "",
        country: initialData.country || ""
      });
      return;
    }

    setLocation(null);
    setVisitedAt("");
    setNotes("");
  }, [isOpen, mode, initialData]);

  useEffect(() => {
    if (!isOpen || !coords || mode !== "create") return;

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
  }, [isOpen, coords, mode]);

  function handleSubmit(e) {
    e.preventDefault();

    if (isSaving) return;

    const newErrors = {};

    if (!visitedAt) {
      newErrors.visitedAt = "Debes indicar la fecha del viaje";
    }

    if (mode === "create" && files.length === 0) {
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
    if (isSaving) return;
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
    <div className="travel-modal__overlay" onClick={handleOverlayClick}>
      <div className="travel-modal">
        <button
          className="travel-modal__close"
          type="button"
          onClick={() => {
            if (!isSaving) onClose();
          }}
          aria-label="Cerrar modal"
          disabled={isSaving}
        >
          ×
        </button>

        <h2 className="travel-modal__title">
          {mode === "edit" ? "Editar viaje" : "Añadir viaje"}
        </h2>

        {location && (
          <p className="travel-modal__location">
            📍 {location.city}
            {location.country ? `, ${location.country}` : ""}
          </p>
        )}

        <form className="travel-modal__form" onSubmit={handleSubmit}>
          <div className="travel-modal__group">
            <label className="travel-modal__label" htmlFor="visitedAt">
              Fecha del viaje
            </label>

            <input
              className="travel-modal__input"
              id="visitedAt"
              type="date"
              value={visitedAt}
              onChange={handleVisitedAtChange}
            />

            {errors.visitedAt && (
              <p className="travel-modal__error">{errors.visitedAt}</p>
            )}
          </div>

          <div className="travel-modal__group">
            <label className="travel-modal__label" htmlFor="notes">
              Notas
            </label>

            <textarea
              className="travel-modal__textarea"
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Añade recuerdos, detalles o curiosidades del viaje..."
              rows="4"
            />
          </div>

          <div className="travel-modal__group">
            <label className="travel-modal__label" htmlFor="files">
              Fotos / vídeos
            </label>

            <input
              className="travel-modal__file-input-hidden"
              id="files"
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFiles}
            />

            <label className="travel-modal__file-btn" htmlFor="files">
              Seleccionar archivos
            </label>

            {errors.files && (
              <p className="travel-modal__error">{errors.files}</p>
            )}

            {files.length > 0 && (
              <p className="travel-modal__files-info">
                {photosCount} foto(s) y {videosCount} vídeo(s) preparados para subir
              </p>
            )}
          </div>
          {isSaving && (
            <p className="travel-modal__progress-text">
              Subiendo archivos... {uploadProgress}%
            </p>
          )}
          {isSaving && (
            <div className="travel-modal__progress">
              <div
                className="travel-modal__progress-bar"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
          <div className="travel-modal__actions">
            <button
              className="travel-modal__btn travel-modal__btn--primary"
              type="submit"
              disabled={isSaving}
            >
              {isSaving
                ? "Guardando..."
                : mode === "edit"
                  ? "Guardar cambios"
                  : "Guardar"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default TravelFormModal;