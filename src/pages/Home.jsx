import GlobeMap from "../components/GlobeMap";
import { useAuth } from "../context/AuthContext";
import { useState } from 'react'
import LoginModal from "../components/LoginModal";


const Home = () => {

  const { user, profile } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <GlobeMap />

      <div className="home">
        <h1 className="home__title"> {user ? `Los viajes de ${profile?.username}` : "Travel Map"}</h1>
        {!user && (
          <button className="home__btn" onClick={() => setIsLoginOpen(true)}>
            Login
          </button>
        )}
      </div>
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </>
  );
};

export default Home;
