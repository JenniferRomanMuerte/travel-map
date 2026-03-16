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

        // La sesión ya está resuelta aquí
        setLoading(false);

        // El profile se carga después, sin bloquear toda la app
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
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}