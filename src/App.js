import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import "./App.scss";
import Labeling from "./Components/labeling";
import Nav from "./Components/nav";
import NavSpace from "./Components/navspace";
import Login from "./Components/login";
import Signup from "./Components/signup";
import Home from "./Components/home";
import Footer from "./Components/footer";
import User from "./Components/user";
import { push as Menu } from "react-burger-menu";
import logo from "./Components/nav/logo.svg";
import { Link, withRouter } from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(...props);
    this.state = {};
    this.releaseLabels = this.releaseLabels.bind(this);
    this.resizeEvent = this.resizeEvent.bind(this);
  }
  componentDidMount() {
    window.addEventListener("resize", this.resizeEvent);
    this.resizeEvent();
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeEvent);
  }
  resizeEvent(evt) {
    if (window.innerWidth > 760) {
      this.setState({ nav: <Nav /> });
    } else {
      this.setState({ nav: <NavSpace/> && this.getHamburgerMenu() });
    }
  }
  releaseLabels(evt) {
    this.props.dispatch(changeLabels([]));
  }
  getHamburgerMenu() {
    if (this.props.logged_in) {
      // logged in and small display, hamburger time
      return (
        <Menu right pageWrapId={"page-wrap"}>
          <a href="https://curbmap.com">
            <img src={logo} height={50} alt="The curbmap logo" />
          </a>
          <Link
            exact
            to="/"
            className={window.location.pathname === "/" ? "active" : "inactive"}
            onClick={this.releaseLabels}
          >
            Participation Hub
          </Link>
          <br />
          <Link
            exact
            to="/labeling"
            className={
              window.location.pathname === "/labeling" ? "active" : "inactive"
            }
          >
            Label
          </Link>
          <br />
          <Link
            exact
            to="/user"
            className={
              window.location.pathname === "/user" ? "active" : "inactive"
            }
            onClick={this.releaseLabels}
          >
            <div className="user-avatar">
              <img
                src={this.composeAvatar(this.props.avatar)}
                width={45}
                height={45}
              />
            </div>
            <div className="user-info">
              <span className="username">{this.props.username}</span>
              <br />
              <span className="email">{this.props.email}</span>
              <br />
              <span className="score">{this.props.score}</span>
            </div>
          </Link>
        </Menu>
      );
    } else {
      // not logged in
      return (
        <Menu
          pageWrapId={"page-wrap"}
          outerContainerId={"outer-container"}
          right
        >
          <a href="https://curbmap.com">
            <img src={logo} height={50} alt="The curbmap logo" />
          </a>
          <Link
            exact
            to="/"
            className={window.location.pathname === "/" ? "active" : "inactive"}
            onClick={this.releaseLabels}
          >
            Participation Hub
          </Link>
          <br />
          <Link
            to="/login"
            className={
              window.location.pathname === "/login" ? "active" : "inactive"
            }
          >
            Login
          </Link>
          <br />
          <Link
            to="/signup"
            className={
              window.location.pathname === "/signup" ? "active" : "inactive"
            }
          >
            Signup
          </Link>
        </Menu>
      );
    }
  }

  render() {
    const labelingprops = {};
    const loginProps = {};
    const signupProps = {};
    return (
      <div id="outer-container">
        <BrowserRouter>
          <div>
          {this.state.nav}
            <div id="page-wrap">
              <Switch>
                {/* Home related routes */}
                <Route
                  exact
                  path="/"
                  render={props => <Home props={props} />}
                />
                {/* Login/Signup related routes */}
                <Route
                  exact
                  path="/login"
                  render={props => <Login props={props} data={loginProps} />}
                />
                <Route
                  exact
                  path="/signup"
                  render={props => <Signup props={props} />}
                />
                {/* labeling task routes */}
                {this.props.labeling}
                {this.props.user}
              </Switch>
              <Footer />
            </div>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}
const mapStateToProps = state => {
  let labeling = null;
  let user = null;
  if (state.auth.logged_in) {
    labeling = (
      <Route
        exact
        path="/labeling"
        render={props => <Labeling props={state} />}
      />
    );
    user = (
      <Route exact path="/user" render={props => <User props={state} />} />
    );
  }
  return {
    logged_in: state.auth.logged_in,
    signed_up: state.auth.signed_up,
    username: state.auth.username,
    email: state.auth.email,
    token: state.auth.token,
    labeling: labeling,
    user: user
  };
};
const mapDispatchToProps = dispatch => {
  return { dispatch };
};

App = connect(mapStateToProps, mapDispatchToProps)(App);
export default App;
