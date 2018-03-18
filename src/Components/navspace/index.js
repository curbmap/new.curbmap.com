import React, { Component } from "react";
import styled from "styled-components";
import background from "./curb.jpg";
import "./navspace.scss";


class NavSpace extends Component {
  render() {
    return (
      <div className="navspace">
        <img className="navspace-image" src={background} alt="A background picture of a curb" />
      </div>
    );
  }
}
export default NavSpace;
