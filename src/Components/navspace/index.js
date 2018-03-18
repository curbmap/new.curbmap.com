import React, { Component } from "react";
import styled from "styled-components";
import background from "./curb.jpg";
import "./navspace.scss";

const ImgBackground = styled.img`
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
`;


class NavSpace extends Component {
  render() {
    return (
      <div className="navspace">
        <ImgBackground src={background} alt="A background picture of a curb" />
      </div>
    );
  }
}
export default NavSpace;
