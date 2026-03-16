const ProcessModal = ({ isOpen, message, type, onClose }) => {
  if (!isOpen) return null;

  let title = "Estado del proceso";

  if (type === "loading") {
    title = "Procesando...";
  } else if (type === "success") {
    title = "Proceso completado";
  } else if (type === "error") {
    title = "Ha ocurrido un error";
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget && type !== "loading") {
      onClose();
    }
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <h3>{title}</h3>

        <p>{message}</p>

        {type !== "loading" && (
          <button type="button" onClick={onClose}>
            Cerrar
          </button>
        )}
      </div>
    </div>
  );
};

export default ProcessModal;