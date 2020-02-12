import React from "react";
import "./Overlay.css"

interface IProps {

}

const Overlay: React.FunctionComponent<IProps> = props => {
  return <div className="overlay-container">{props.children}</div>;
};

export default Overlay