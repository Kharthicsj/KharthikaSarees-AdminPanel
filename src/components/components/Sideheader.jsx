import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import "../Styles/Sideheader.css";

const Sideheader = () => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="sidebar-container">
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="menu-item-container">
          <div className="menu-item" onClick={() => navigate('/cotton')}>
            <span className="material-symbols-outlined">add</span>
            <span className="menu-label">Add</span>
          </div>
          <div className="menu-item" onClick={() => navigate('/users')}>
            <span className="material-symbols-outlined">person</span>
            <span className="menu-label">Users</span>
          </div>
          <div className="menu-item" onClick={() => navigate('/data')}>
            <span className="material-symbols-outlined">bar_chart</span>
            <span className="menu-label">Data</span>
          </div>
          <div className="menu-item" onClick={() => navigate('/inventory')}>
            <span className="material-symbols-outlined">inventory</span>
            <span className="menu-label">Inventory</span>
          </div>
          <div className="menu-item" onClick={() => navigate('/orders')}>
            <span className="material-symbols-outlined">list</span>
            <span className="menu-label">Orders</span>
          </div>
        </div>
      </div>
      <span
        className="material-symbols-outlined arrow-icon"
        onClick={toggleSidebar}
      >
        arrow_forward
      </span>
    </div>
  );
};

export default Sideheader;
