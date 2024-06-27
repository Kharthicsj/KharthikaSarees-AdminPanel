import React from 'react';
import '../Styles/Loading.css';

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">Uploading...</p>
    </div>
  );
}

export default Loading;
