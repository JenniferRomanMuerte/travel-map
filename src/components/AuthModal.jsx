import AuthForm from "./AuthForm";

const AuthModal = ({ isOpen, mode, onClose, switchMode }) => {

  if (!isOpen) return null;

  return (

    <div className="modal-overlay">

      <div className="modal">

        <h2>
          {mode === "login" ? "Login" : "Crear cuenta"}
        </h2>

        <AuthForm
          mode={mode}
          onSuccess={onClose}
        />

        <button onClick={onClose}>
          Cancelar
        </button>

        {mode === "login" ? (

          <p>
            ¿No tienes cuenta?{" "}
            <button onClick={() => switchMode("register")}>
              Crear cuenta
            </button>
          </p>

        ) : (

          <p>
            ¿Ya tienes cuenta?{" "}
            <button onClick={() => switchMode("login")}>
              Login
            </button>
          </p>

        )}

      </div>

    </div>

  );

};

export default AuthModal;