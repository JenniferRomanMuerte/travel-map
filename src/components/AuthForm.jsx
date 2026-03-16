import { useEffect, useState } from "react";
import { login, register } from "../services/authService";

const AuthForm = ({ mode, onSuccess }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [error, setError] = useState("");

  // resetear formulario cuando cambia login/register
  useEffect(() => {

    setEmail("");
    setPassword("");
    setUsername("");
    setError("");

  }, [mode]);

  async function handleSubmit(e) {

    e.preventDefault();
    setError("");

    try {

      if (mode === "login") {
        await login(email, password);
      }

      if (mode === "register") {
        await register(email, password, username);
      }

      onSuccess();

    } catch (err) {

      setError("Error de autenticación");

    }

  }

  return (

    <form onSubmit={handleSubmit}>

      {mode === "register" && (
        <>
          <label>Username</label>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </>
      )}

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
        {mode === "login" ? "Entrar" : "Crear cuenta"}
      </button>

    </form>

  );

};

export default AuthForm;