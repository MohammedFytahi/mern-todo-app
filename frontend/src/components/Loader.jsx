import React from "react";

const Loader = ({ size = "medium", message = "Chargement..." }) => {
  const sizeClass = {
    small: "loader-small",
    medium: "loader-medium",
    large: "loader-large"
  };

  return (
    <div className="loader-container">
      <div className={`loader-spinner ${sizeClass[size]}`}></div>
      {message && <p className="loader-message">{message}</p>}
    </div>
  );
};

export default Loader;