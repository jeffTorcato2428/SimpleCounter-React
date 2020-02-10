import React from "react";
import "./Spinner.css";

const Spinner = props => {
  return (
    <div className="spinner-container">
      <div className="outer-spinner" />
      <div className="inner-spinner" />
    </div>
  );
};

export default Spinner;
