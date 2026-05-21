import { useAuth } from "../context/AuthContext";
import AuthForm from "./AuthForm";

const AuthModal = ({ isOpen, mode, onClose, switchMode }) => {
  const { setUser } = useAuth();

  if (!isOpen) return null;

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  function handleSuccess(user) {
    setUser(user);
    if (user?.username) {
      localStorage.setItem("travelmap_username", user.username);
    }
    onClose();
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
          <AuthForm mode={mode} onSuccess={handleSuccess} />
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
