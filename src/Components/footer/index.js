import React, { Component } from "react";
import "./footer.css";
import hfla from "./logo-hfla.svg";

class Footer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="footer-holder">
        <div className="footer">
        <div className="footer-left">
          Contact us<br />
          About us<br />
          </div>
          <div className="footer-organization">
            {(window.innerWidth > 600) && "Curbmap was fostered with support from "}
            <a href="http://hackforla.org"><img src={hfla} height={45} style={{ verticalAlign: "middle" }} alt="Hack for LA logo" /></a>
          </div>
        </div>
        <div className="footer-base">
          &copy; 2018 curbmap.{" "}
          <a href="https://curbmap.com/terms"> Terms &amp; Conditions</a>
        </div>
      </div>
    );
  }
}

export default Footer;
