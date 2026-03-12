import { useState, useEffect } from "react";

const TravelFormModal = ({ isOpen, onClose, onSave, coords }) => {

  const [location, setLocation] = useState(null);
  const [visitedAt, setVisitedAt] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});

  // limpiar formulario cuando se cierre el modal
  useEffect(() => {

    if (!isOpen) {

      setVisitedAt("");
      setNotes("");
      setFiles([]);

    }

  }, [isOpen]);

  useEffect(() => {

    if (!isOpen || !coords) return;

    async function fetchLocation() {

      const token = import.meta.env.VITE_MAPBOX_TOKEN;

      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords.lng},${coords.lat}.json?types=place&access_token=${token}`
      );

      const data = await res.json();

      let city = "Lugar desconocido";
      let country = "";

      if (data.features.length > 0) {

        city = data.features[0].text;

        const countryContext = data.features[0].context?.find(c =>
          c.id.includes("country")
        );

        if (countryContext) {
          country = countryContext.text;
        }

      }

      setLocation({ city, country });

    }

    fetchLocation();

  }, [isOpen, coords]);


  // Envío del formulario
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

  // Captura de archivos
  function handleFiles(e) {

    const newFiles = Array.from(e.target.files);

    setFiles(prevFiles => {

      const filteredFiles = newFiles.filter(newFile => {

        return !prevFiles.some(existingFile =>
          existingFile.name === newFile.name &&
          existingFile.size === newFile.size &&
          existingFile.lastModified === newFile.lastModified
        );

      });

      return [...prevFiles, ...filteredFiles];

    });

    // permite volver a seleccionar el mismo archivo
    e.target.value = "";

  }

  if (!isOpen) return null;

  const photosCount = files.filter(file =>
    file.type.startsWith("image")
  ).length;

  const videosCount = files.filter(file =>
    file.type.startsWith("video")
  ).length;


  return (

    <div className="modal-overlay">

      <div className="modal">

        <h2 className="modal__title">Añadir viaje</h2>
        {location && (
          <p className="modal__location">
            📍 {location.city}, {location.country}
          </p>
        )}

        <form className="modal__form" onSubmit={handleSubmit}>

          <label>Fecha del viaje</label>

          <input
            type="date"
            value={visitedAt}
            onChange={(e) => setVisitedAt(e.target.value)}
          />
          {errors.visitedAt && (
            <p className="form-error">{errors.visitedAt}</p>
          )}

          <label>Notas</label>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <label>Fotos / videos</label>

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
              {photosCount} foto(s) y {videosCount} video(s) preparados para subir
            </p>
          )}

          <div className="modal__form--buttons">

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