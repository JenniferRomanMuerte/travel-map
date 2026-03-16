import { useState } from "react";
import { supabase } from "../lib/supabase";

const AuthForm = ({ mode, onSuccess }) => {
  const isRegister = mode === "register";

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(ev) {
    const { name, value } = ev.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setError("");
    setLoading(true);

    const email = formData.email.trim();
    const password = formData.password.trim();
    const username = formData.username.trim();

    try {
      if (isRegister) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) {
          throw signUpError;
        }

        const userId = data?.user?.id;

        if (userId) {
          const { error: profileError } = await supabase
            .from("profiles")
            .insert([
              {
                id: userId,
                username,
              },
            ]);

          if (profileError) {
            throw profileError;
          }
        }

        onSuccess();
        return;
      }

      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        throw loginError;
      }

      onSuccess();
    } catch (err) {
      console.error("Error en auth:", err);
      setError(err.message || "Ha ocurrido un error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {isRegister && (
        <div className="auth-form__group">
          <label className="auth-form__label" htmlFor="username">
            Nombre de usuario
          </label>
          <input
            className="auth-form__input"
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Tu nombre de usuario"
            required
          />
        </div>
      )}

      <div className="auth-form__group">
        <label className="auth-form__label" htmlFor="email">
          Email
        </label>
        <input
          className="auth-form__input"
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="tuemail@mail.com"
          required
        />
      </div>

      <div className="auth-form__group">
        <label className="auth-form__label" htmlFor="password">
          Contraseña
        </label>
        <input
          className="auth-form__input"
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="********"
          required
        />
      </div>

      {error && <p className="auth-form__error">{error}</p>}

      <button
        className="auth-form__submit"
        type="submit"
        disabled={loading}
      >
        {loading
          ? "Cargando..."
          : isRegister
          ? "Crear cuenta"
          : "Entrar"}
      </button>
    </form>
  );
};

export default AuthForm;