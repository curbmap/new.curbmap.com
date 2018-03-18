import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import styled from "styled-components";
import AnimateHeight from "react-animate-height";
import messages from "./messages.js";
import background from "./curb.jpg";
import { changeLabels } from "../../Actions/label.action.creators";
import logo from "./logo.svg";
import "./nav.scss";
import avatar from "./avatar.svg";

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
    backgroundColor: "hsla(218, 50%, 20%, 1.0)",
    color: "white",
    textDecoration: "none",
    marginLeft: "5px"
  }
};

class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 125,
      message: null,
      messageVisible: true,
      menu: null
    };
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.showMenu = this.showMenu.bind(this);
    this.releaseLabels = this.releaseLabels.bind(this);
    this.resizeEvent = this.resizeEvent.bind(this);
  }
  releaseLabels(evt) {
    this.props.dispatch(changeLabels([]));
  }
  onMouseOver(evt) {
    evt.target.classList.replace("inactive", "hovering");
  }
  onMouseOut(evt) {
    evt.target.classList.replace("hovering", "inactive");
  }
  onMouseEnter(evt) {
    console.log(this.props);
    if (
      this.props.location.pathname !== "/labeling"
    ) {
      this.setState({ height: 300 });
      this.showMenu();
    }
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
      this.setState({
        menu: (
          <div className="navbar">
            <div className="left-nav">
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
              <Link
                exact
                to="/"
                className={
                  this.props.location.pathname === "/" ? "active" : "inactive"
                }
                onMouseOver={this.onMouseOver}
                onMouseOut={this.onMouseOut}
                onClick={this.releaseLabels}
              >
                Participation Hub
              </Link>
              {" | "}
              <Link
                exact
                to="/labeling"
                className={
                  this.props.location.pathname === "/labeling"
                    ? "active"
                    : "inactive"
                }
                onMouseOver={this.onMouseOver}
                onMouseOut={this.onMouseOut}
              >
                Label
              </Link>
            </div>
            <div className="right-nav">
              <div className="user-bar">
                <Link
                  exact
                  to="/user"
                  className={
                    this.props.location.pathname === "/user"
                      ? "active"
                      : "inactive"
                  }
                  onClick={this.releaseLabels}
                >
                  <div className="user-info">
                    <span className="username">{this.props.username}</span>
                    <br />
                    <span className="email">{this.props.email}</span>
                    <br />
                    <span className="score">{this.props.score}</span>
                  </div>
                  <div className="user-avatar">
                    <img
                      src={this.composeAvatar(this.props.avatar)}
                      width={45}
                      height={45}
                    />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )
      });
    } else {
      this.setState({
        menu: (
          <div className="navbar">
            <div className="left-nav">
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
              <Link
                to="/"
                className={
                  window.location.pathname === "/" ? "active" : "inactive"
                }
                onMouseOver={this.onMouseOver}
                onMouseOut={this.onMouseOut}
              >
                Participation Hub
              </Link>
              {" | "}
              <Link
                to="/login"
                className={
                  window.location.pathname === "/login" ? "active" : "inactive"
                }
                onMouseOver={this.onMouseOver}
                onMouseOut={this.onMouseOut}
              >
                Login
              </Link>
              {" | "}
              <Link
                to="/signup"
                className={
                  window.location.pathname === "/signup" ? "active" : "inactive"
                }
                onMouseOver={this.onMouseOver}
                onMouseOut={this.onMouseOut}
              >
                Signup
              </Link>
            </div>
          </div>
        )
      });
    }
  }
  chooseRandomMessage() {
    let messageKeys = Object.keys(messages);
    let randMessage = Math.round(Math.random() * messageKeys.length);
    while (randMessage >= messageKeys.length) {
      randMessage = Math.round(Math.random() * messageKeys.length);
    }
    return messages[messageKeys[randMessage]];
  }
  getRandomMessage() {
    const message = this.chooseRandomMessage();
    this.setState({
      message:  (
        <div className="random-message-holder">
          <div className="random-message">{message}</div>
        </div>
      )
    });
  }
  render() {
    return (
      <AnimateHeight
        height={this.state.height}
        duration={500}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        style={styles.nav}
        ref="heightholder"
      >
        <ImgBackground src={background} alt="A background picture of a curb" />
        {this.state.menu}
        <br />
        {this.state.message}
        <br />
      </AnimateHeight>
    );
  }
  composeAvatar(components) {
    // in future will actually get an array of values to construct the avatar in layers
    return avatar;
  }
}
const mapStateToProps = state => {
  return {
    logged_in: state.auth.logged_in,
    signed_up: state.auth.signed_up,
    session: state.auth.session,
    email: state.auth.email,
    score: state.auth.score,
    username: state.auth.username
  };
};
const mapDispatchToProps = dispatch => {
  return {
    dispatch
  };
};
Nav = connect(mapStateToProps, mapDispatchToProps)(Nav);
export default withRouter(Nav);
