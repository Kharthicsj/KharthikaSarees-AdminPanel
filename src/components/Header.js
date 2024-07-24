import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../Styles/Header.css';
import loginLogo from '../Assets/loginLogo.png';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const sessionExpiry = localStorage.getItem('sessionExpiry');
    if (loggedIn && sessionExpiry && new Date().getTime() > sessionExpiry) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('sessionExpiry');
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(loggedIn);
    }
  }, [location]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <div className="header-container">
      <header className="header">
        <div className="header-left">
          <img src={loginLogo} alt="Logo" className="logo" draggable='false' />
        </div>
        <div className={`header-right ${menuOpen ? 'open' : ''}`}>
          <nav className="nav">
            {isLoggedIn ? (
              <>
                <Link to="/cotton" className="nav-item">Cotton</Link>
                <Link to="/kotta" className="nav-item">Kotta Cotton</Link>
                <Link to="/softsilk" className="nav-item">SoftSilk</Link>
                <Link to="/pochampalli" className="nav-item">Pochampalli</Link>
                <Link to="/silkcotton" className="nav-item">Silk Cotton</Link>
                <button onClick={handleLogout} className='nav-item-button'>Logout</button>
              </>
            ) : (
              <Link to="/" className='nav-item'>Login</Link>
            )}
          </nav>
        </div>
        <button className="menu-icon" onClick={toggleMenu}>
          <span className="material-symbols-outlined">menu</span>
        </button>
      </header>
      {menuOpen && (
        <div className="menu-options">
          <Link to="/" className="nav-item">Cotton</Link>
          <Link to="/kotta" className="nav-item">Kotta Cotton</Link>
          <Link to="/softsilk" className="nav-item">SoftSilk</Link>
          <Link to="/silkcotton" className="nav-item">Silk Cotton</Link>
          <Link to="/pochampalli" className="nav-item">Pochampalli</Link>
        </div>
      )}
    </div>
  );
};

export default Header;
