import React from "react";
import "./Overlay.css"

const Overlay = props => {
  return <div className="overlay-container">{props.children}</div>;
};

export default Overlay