import AuthForm from "./AuthForm";

const AuthModal = ({ isOpen, mode, onClose, switchMode }) => {
  if (!isOpen) return null;

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

   return (
    <div className="auth-modal__overlay" onClick={handleOverlayClick}>
      <div className="auth-modal">
        <button
          className="auth-modal__close"
          type="button"
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          ×
        </button>

        <h2 className="auth-modal__title">
          {mode === "login" ? "Login" : "Crear cuenta"}
        </h2>

        <div className="auth-modal__form">
          <AuthForm
            mode={mode}
            onSuccess={onClose}
          />
        </div>

        <p className="auth-modal__switch-text">
          {mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
          <button
            className="auth-modal__switch-btn"
            type="button"
            onClick={() => switchMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? "Crear cuenta" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;