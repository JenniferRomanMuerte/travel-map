const ProcessModal = ({ isOpen, message, type, onClose }) => {

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">

      <div className="modal">

        <h3>
          {type === "loading" && "Procesando..."}
          {type === "success" && "Proceso completado"}
          {type === "error" && "Ha ocurrido un error"}
        </h3>

        <p>{message}</p>

        {type !== "loading" && (
          <button onClick={onClose}>
            Cerrar
          </button>
        )}

      </div>

    </div>
  );

};

export default ProcessModal;