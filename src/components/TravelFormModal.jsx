import { useState, useEffect } from "react";

const TravelFormModal = ({ isOpen, onClose, onSave, coords }) => {

  const [visitedAt, setVisitedAt] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState([]);

  // limpiar formulario cuando se cierre el modal
  useEffect(() => {

    if (!isOpen) {

      setVisitedAt("");
      setNotes("");
      setFiles([]);

    }

  }, [isOpen]);


  // Envío del formulario
  function handleSubmit(e) {

    e.preventDefault();

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

        <form className="modal__form" onSubmit={handleSubmit}>

          <label>Fecha del viaje</label>

          <input
            type="date"
            value={visitedAt}
            onChange={(e) => setVisitedAt(e.target.value)}
          />

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
          <p>
            {files.length === 0
              ? "Ningún archivo seleccionado"
              : `${photosCount} foto(s) y ${videosCount} video(s) preparados para subir`}
          </p>

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