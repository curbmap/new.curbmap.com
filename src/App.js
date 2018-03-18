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
import avatar from "./Components/nav/avatar.svg";
import { Link, withRouter } from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { menuopen: false, currentClick: "/", logged_in: false };
    this.resizeEvent = this.resizeEvent.bind(this);
    this.hideMenu = this.hideMenu.bind(this);
    this.recreateMenu = this.recreateMenu.bind(this);
    this.composeAvatar = this.composeAvatar.bind(this);
  }
  componentDidMount() {
    console.log("componentDidMount");
    window.addEventListener("resize", this.resizeEvent);
    this.recreateMenu("/");
  }
  componentDidUpdate() {
    if (this.props.logged_in) {
      if (!this.state.logged_in) {
        this.setState({ logged_in: true });
        this.recreateMenu("/");
      }
    } else {
      if (this.state.logged_in) {
        this.setState({ logged_in: false });
        this.recreateMenu("/");
      }
    }
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeEvent);
  }
  componentWillReceiveProps() {
    this.setState({ currentClick: "/" });
  }
  resizeEvent(evt) {
    this.recreateMenu(this.state.currentClick);
  }
  recreateMenu(click) {
    console.log("XX", click);
    if (window.innerWidth > 760) {
      this.setState({ nav: <Nav />, menu: null });
    } else {
      this.setState({
        nav: <NavSpace />,
        menu: this.getHamburgerMenu(click),
        menuopen: false
      });
    }
  }
  hideMenu(evt) {
    let href = evt.currentTarget.href.split("/");
    let click = "/" + href[href.length - 1];
    this.setState({
      nav: <NavSpace />,
      menu: this.getHamburgerMenu(click),
      menuopen: false,
      currentClick: click
    });
    this.forceUpdate();
  }
  getHamburgerMenu(currentClick) {
    if (this.props.logged_in) {
      // logged in and small display, hamburger time
      return (
        <Menu
          isOpen={this.state.menuopen}
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
            className={currentClick === "/" ? "active" : "inactive"}
            onClick={this.hideMenu}
          >
            Participation Hub
          </Link>
          <br />
          <Link
            exact
            to="/labeling"
            className={currentClick === "/labeling" ? "active" : "inactive"}
            onClick={this.hideMenu}
          >
            Label
          </Link>
          <br />
          <Link
            exact
            to="/user"
            className={currentClick === "/user" ? "active" : "inactive"}
            onClick={this.hideMenu}
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
          isOpen={this.state.menuopen}
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
            className={currentClick === "/" ? "active" : "inactive"}
            onClick={this.hideMenu}
          >
            Participation Hub
          </Link>
          <br />
          <Link
            to="/login"
            className={currentClick === "/login" ? "active" : "inactive"}
            onClick={this.hideMenu}
          >
            Login
          </Link>
          <br />
          <Link
            to="/signup"
            className={currentClick === "/signup" ? "active" : "inactive"}
            onClick={this.hideMenu}
          >
            Signup
          </Link>
        </Menu>
      );
    }
  }
  composeAvatar(components) {
    // in future will actually get an array of values to construct the avatar in layers
    return avatar;
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
            {this.state.menu}
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
  console.log(state);
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
