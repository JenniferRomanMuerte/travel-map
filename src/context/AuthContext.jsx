import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, logout as logoutService } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((u) => {
        setUser(u);
        if (u?.username) {
          localStorage.setItem("travelmap_username", u.username);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function logout() {
    await logoutService();
    setUser(null);
  }

  const profile = user ? { username: user.username } : null;

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
