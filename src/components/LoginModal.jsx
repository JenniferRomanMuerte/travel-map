import { useState } from "react";
import { login } from "../services/authService";

const LoginModal = ({ isOpen, onClose }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  async function handleSubmit(e) {

    e.preventDefault();
    setError("");

    try {

      await login(email, password);
      onClose();

    } catch (err) {

      setError("Credenciales incorrectas");

    }

  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">

      <div className="modal">

        <h2>Login</h2>

        <form onSubmit={handleSubmit}>

          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="form-error">{error}</p>}

          <button type="submit">
            Login
          </button>

          <button type="button" onClick={onClose}>
            Cancelar
          </button>

        </form>

      </div>

    </div>
  );

};

export default LoginModal;