import { Link } from "react-router-dom";

const Navbar = ({
  title,
  user,
  loading,
  onLogin,
  onRegister,
  onLogout,
}) => {
  return (
    <header className="navbar">
       <div className="navbar__inner">
      <div className="navbar__brand">
        <Link to="/" className="navbar__title">
          {title}
        </Link>
      </div>

      <nav className="navbar__actions">
        {!loading && !user && (
          <>
            <button className="navbar__btn" onClick={onLogin}>
              Login
            </button>

            <button className="navbar__btn navbar__btn--primary" onClick={onRegister}>
              Crear cuenta
            </button>
          </>
        )}

        {!loading && user && (
          <button className="navbar__btn" onClick={onLogout}>
            Logout
          </button>
        )}
      </nav>
      </div>
    </header>
  );
};

export default Navbar;