const ConfirmModal = ({
  isOpen,
  title = "Confirmar acción",
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onClose,
  danger = false,
}) => {
  if (!isOpen) return null;

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <div className="confirm-modal__overlay" onClick={handleOverlayClick}>
      <div className={`confirm-modal ${danger ? "confirm-modal--danger" : ""}`}>
        <h3 className="confirm-modal__title">{title}</h3>

        <p className="confirm-modal__message">{message}</p>

        <div className="confirm-modal__actions">
          <button
            type="button"
            className="confirm-modal__btn confirm-modal__btn--secondary"
            onClick={onClose}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className="confirm-modal__btn confirm-modal__btn--danger"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;