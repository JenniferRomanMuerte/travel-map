const ProcessModal = ({
  isOpen,
  message,
  type,
  onClose,
  autoClose = false,
  hideCloseButton = false,
}) => {
  if (!isOpen) return null;

  let title = "Estado del proceso";

  if (type === "success") {
    title = "Proceso completado";
  } else if (type === "error") {
    title = "Ha ocurrido un error";
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget && !autoClose) {
      onClose();
    }
  }

  return (
    <div className="process-modal__overlay" onClick={handleOverlayClick}>
      <div className={`process-modal process-modal--${type}`}>
        <h3 className="process-modal__title">{title}</h3>
        <p className="process-modal__message">{message}</p>

        {!hideCloseButton && (
          <div className="process-modal__actions">
            <button
              type="button"
              className="process-modal__btn"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessModal;