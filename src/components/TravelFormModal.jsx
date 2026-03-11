import { useState } from "react";

const TravelFormModal = ({ isOpen, onClose, onSave, coords }) => {

  const [visitedAt, setVisitedAt] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState([]);

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();

    onSave({
      visitedAt,
      notes,
      files,
      coords
    });

    onClose();
  }

  return (

    <div className="modal-overlay">

      <div className="modal">

        <h2  className="modal__title">Añadir viaje</h2>

        <form  className="modal__form" onSubmit={handleSubmit}>

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
            onChange={(e) => setFiles(e.target.files)}
          />

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