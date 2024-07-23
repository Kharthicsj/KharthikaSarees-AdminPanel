import React from "react";
import "../Styles/Loading.css"; // Make sure to include your styles for loading

const Loading = ({ text }) => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>{text}</p>
    </div>
  );
};

export default Loading;
