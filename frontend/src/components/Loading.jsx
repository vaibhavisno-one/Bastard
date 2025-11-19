import React from 'react';
import './Loading.scss';

const Loading = ({ fullScreen = false }) => {
  return (
    <div className={`loading-container ${fullScreen ? 'fullscreen' : ''}`}>
      <div className="loading-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        {/* <div className="brand-text">Bastard</div> */}
        <img
          src="/Bastard.png"
          alt="Bastard Logo"
          height={54}
          className="logo h-12 w-auto object-contain"
        />
      </div>
    </div>
  );
};

export default Loading; 