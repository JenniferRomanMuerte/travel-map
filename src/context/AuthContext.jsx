import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // -----------------------------------------
  // CARGAR PERFIL
  // -----------------------------------------

  async function loadProfile(currentUser) {


    try {

      //  intentar username desde metadata
      const metadataUsername = currentUser.user_metadata?.username;

      if (metadataUsername) {

        setProfile({ username: metadataUsername });
        return;

      }

      // fallback → consultar tabla profiles
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

    } catch (err) {

      console.error("Error inesperado cargando profile:", err);
      setProfile(null);

    }

  }

  // -----------------------------------------
  // EFECTO PRINCIPAL
  // -----------------------------------------

  useEffect(() => {

    async function loadUser() {

      try {

        const { data, error } = await supabase.auth.getUser();

        if (error) {
          console.error("Error obteniendo usuario:", error);
          setLoading(false);
          return;
        }

        const currentUser = data?.user ?? null;

        setUser(currentUser);

        if (currentUser) {
          await loadProfile(currentUser);
        }

      } catch (err) {

        console.error("Error cargando usuario:", err);

      }

      setLoading(false);

    }

    loadUser();

    // -----------------------------------------
    // ESCUCHAR CAMBIOS DE AUTH
    // -----------------------------------------

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {

        const currentUser = session?.user ?? null;

        setUser(currentUser);



        if (currentUser) {
          await loadProfile(currentUser);
         
        } else {
          setProfile(null);
        }

      }
    );

    return () => {
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