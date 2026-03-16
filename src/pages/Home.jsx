import GlobeMap from "../components/GlobeMap";
import AuthModal from "../components/AuthModal";
import Navbar from "../components/NavBar";
import { useAuth } from "../context/AuthContext";
import { useMemo, useState } from "react";

const Home = () => {
  const { user, profile, loading, logout } = useAuth();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  function openLogin() {
    setAuthMode("login");
    setIsAuthOpen(true);
  }

  function openRegister() {
    setAuthMode("register");
    setIsAuthOpen(true);
  }

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }

  const username =
    profile?.username ||
    localStorage.getItem("travelmap_username") ||
    "";

  const title =
    user && username ? `Los viajes de ${username}` : "Travel Map";

  return (
    <>
      <Navbar
        title={title}
        user={user}
        loading={loading}
        onLogin={openLogin}
        onRegister={openRegister}
        onLogout={handleLogout}
      />

      <GlobeMap />

      <AuthModal
        isOpen={isAuthOpen}
        mode={authMode}
        onClose={() => setIsAuthOpen(false)}
        switchMode={setAuthMode}
      />
    </>
  );
};

export default Home;