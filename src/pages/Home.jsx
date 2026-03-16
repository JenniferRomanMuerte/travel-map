import GlobeMap from "../components/GlobeMap";
import AuthModal from "../components/AuthModal";
import { useAuth } from "../context/AuthContext";
import { useState } from 'react'


const Home = () => {

  const { user, profile, loading } = useAuth();
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


  return (
    <>
      {!loading && <GlobeMap />}

      <div className="home">
        <h1 className="home__title">{loading
          ? "Travel Map"
          : user
            ? `Los viajes de ${profile?.username}`
            : "Travel Map"}</h1>
        {!user && (
          <>
            <button className="home__btn" onClick={openLogin}>
              Login
            </button>

            <button className="home__btn" onClick={openRegister}>
              Crear cuenta
            </button>
          </>
        )}
      </div>
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
