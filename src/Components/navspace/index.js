import React, { Component } from "react";
import styled from "styled-components";
import background from "./curb.jpg";
import logo from "../nav/logo.svg";
import "./navspace.scss";


class NavSpace extends Component {
  render() {
    return (
      <div className="navspace">
        <img className="navspace-image" src={background} alt="A background picture of a curb" />
        <a href="https://curbmap.com"><img className="navspace-logo" src={logo} alt="curbmap logo" /></a>
      </div>
    );
  }
}
export default NavSpace;
