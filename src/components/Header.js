import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Header.css';
import loginLogo from '../Assets/loginLogo.png';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="header-container">
      <header className="header">
        <div className="header-left">
          <img src={loginLogo} alt="Logo" className="logo" draggable='false'/>
        </div>
        <div className={`header-right ${menuOpen ? 'open' : ''}`}>
          <nav className="nav">
            <Link to="/" className="nav-item">Cotton</Link>
            <Link to="/kotta" className="nav-item">Kotta Cotton</Link>
            <Link to="/softsilk" className="nav-item">SoftSilk</Link>
            <Link to="/pochampalli" className="nav-item">Pochampalli</Link>
            <Link to="/silkcotton" className="nav-item">Silk Cotton</Link>
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
