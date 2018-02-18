import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink, withRouter } from "react-router-dom";
import styled from "styled-components";
import AnimateHeight from "react-animate-height";
import messages from "./messages.js";
import background from "./curb.jpg";
import logo from "./logo.svg";
import "./nav.css";

const ImgBackground = styled.img`
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
`;

const styles = {
  nav: {
    marginTop: 0,
    marginBottom: 10,
    marginLeft: 0,
    marginRight: 0,
    zIndex: 0,
    position: "relative"
  },
  activeStyle: {
    padding: "10px",
    backgroundColor: "rgba(0,0,100, 1)",
    color: "white",
    textDecoration: "none",
    marginLeft: "5px",
    borderRadius: "10px"
  }
};

class Nav extends Component {
  constructor(props) {
    super(props);
    console.log("Nav this:", this);
    this.state = {
      height: 125,
      message: null,
      messageVisible: true
    };
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.showMenu = this.showMenu.bind(this);
  }
  onMouseOver(evt) {
    evt.target.classList.add("hovering");
  }
  onMouseOut(evt) {
    evt.target.classList.remove("hovering");
  }
  onMouseEnter(evt) {
    this.setState({ height: 300 });
    this.showMenu();
  }
  showMenu() {
    this.getRandomMessage();
    this.setState({ messageVisible: true });
  }
  onMouseLeave(evt) {
    this.setState({ height: 125, message: null, messageVisible: false });
  }
  getMenu() {
    if (this.props.logged_in) {
      return (
        <div style={{ zIndex: 100, position: "relative", paddingTop: 10 }}>
          <a href="https://curbmap.com">
            <img
              src={logo}
              height={100}
              style={{
                display: "inline",
                verticalAlign: "middle",
                paddingLeft: 15,
                paddingRight: 15
              }}
              alt="The curbmap logo"
            />
          </a>
          <NavLink
            exact
            to="/"
            className="inactive"
            onMouseOver={this.onMouseOver}
            onMouseOut={this.onMouseOut}
            activeStyle={styles.activeStyle}
          >
            Home
          </NavLink>
          <NavLink
            exact
            to="/labeling"
            className="inactive"
            onMouseOver={this.onMouseOver}
            onMouseOut={this.onMouseOut}
            activeStyle={styles.activeStyle}
          >
            Label
          </NavLink>
          <NavLink
            exact
            to="/news"
            className="inactive"
            onMouseOver={this.onMouseOver}
            onMouseOut={this.onMouseOut}
            activeStyle={styles.activeStyle}
          >
            News
          </NavLink>
        </div>
      );
    } else {
      return (
        <div style={{ position: "relative", zIndex: 1, paddingTop: 10 }}>
          <a href="https://curbmap.com">
            <img
              src={logo}
              height={100}
              style={{
                verticalAlign: "middle",
                paddingLeft: 15,
                paddingRight: 15
              }}
              alt="the curbmap logo."
            />
          </a>
          <NavLink
            exact
            to="/"
            className="inactive"
            onMouseOver={this.onMouseOver}
            onMouseOut={this.onMouseOut}
            activeStyle={styles.activeStyle}
          >
            Home
          </NavLink>
          <NavLink
            exact
            to="/login"
            className="inactive"
            onMouseOver={this.onMouseOver}
            onMouseOut={this.onMouseOut}
            activeStyle={styles.activeStyle}
          >
            Login
          </NavLink>
          <NavLink
            exact
            to="/signup"
            className="inactive"
            onMouseOver={this.onMouseOver}
            onMouseOut={this.onMouseOut}
            activeStyle={styles.activeStyle}
          >
            Signup
          </NavLink>
          <NavLink
            exact
            to="/news"
            className="inactive"
            onMouseOver={this.onMouseOver}
            onMouseOut={this.onMouseOut}
            activeStyle={styles.activeStyle}
          >
            News
          </NavLink>
        </div>
      );
    }
  }
  chooseRandomMessage() {
    let messageKeys = Object.keys(messages);
    let randMessage = Math.round(Math.random() * messageKeys.length);
    return messages[messageKeys[randMessage]];
  }
  getRandomMessage() {
    const message = this.chooseRandomMessage();
    console.log(message);
    this.setState({
      message: (
        <div
          style={{
            zIndex: 10,
            position: "relative",
            width: "100%",
            height: 200,
            textAlign: "center",
            paddingLeft: "20%"
          }}
        >
          <div
            style={{
              position: "relative",
              width: "50%",
              minWidth: 700,
              height: 150,
              backgroundColor: "rgba(200,200,200,0.8)",
              borderRadius: 10
            }}
          >
            {message}
            <br />
          </div>
        </div>
      )
    });
    console.log("Nav state in random message:", this.state);
  }
  render() {
    console.log("Nav context:", this.context);
    console.log("Nav state:", this.state);
    console.log("Nav props:", this.props);
    return (
      <AnimateHeight
        height={this.state.height}
        duration={500}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        style={styles.nav}
        ref="heightholder"
      >
        <ImgBackground src={background} alt="A background picture of a curb"/>
        {this.getMenu()}
        <br />
        {this.state.message}
        <br />
      </AnimateHeight>
    );
  }
}
const mapStateToProps = state => {
  console.log("NAV MAPSTATETOPROPS", state);
  return {
    logged_in: state.logged_in,
    signed_up: state.signed_up,
    session: state.session
  };
};
const mapDispatchToProps = dispatch => {
  console.log("NAV MAPDISPATCHTOPROPS", dispatch);
  return {
  };
};
Nav = connect(mapStateToProps, mapDispatchToProps)(Nav);
export default withRouter(Nav);
