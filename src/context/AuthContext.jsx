import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile(currentUser) {
    if (!currentUser) {
      setProfile(null);
      localStorage.removeItem("travelmap_username");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", currentUser.id)
        .single();

      if (error) {
        console.error("Error cargando profile:", error);
        setProfile(null);
        return;
      }

      setProfile(data);

      if (data?.username) {
        localStorage.setItem("travelmap_username", data.username);
      }
    } catch (err) {
      console.error("Error inesperado cargando profile:", err);
      setProfile(null);
    }
  }

  async function logout() {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Error al cerrar sesión:", error);
        throw error;
      }

      setUser(null);
      setProfile(null);
      localStorage.removeItem("travelmap_username");
    } catch (err) {
      console.error("Error inesperado en logout:", err);
      throw err;
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error obteniendo sesión:", error);
        }

        const currentUser = data?.session?.user ?? null;

        if (!isMounted) return;

        setUser(currentUser);
        setLoading(false);

        if (currentUser) {
          loadProfile(currentUser);
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error("Error inicializando auth:", err);

        if (!isMounted) return;

        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    }

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!isMounted) return;

        const currentUser = session?.user ?? null;

        setUser(currentUser);

        if (currentUser) {
          loadProfile(currentUser);
        } else {
          setProfile(null);
          localStorage.removeItem("travelmap_username");
        }
      }
    );

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}