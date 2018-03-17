import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import "./App.css";
import Labeling from "./Components/labeling";
import Nav from "./Components/nav";
import Login from "./Components/login";
import Signup from "./Components/signup";
import Home from "./Components/home";
import Footer from "./Components/footer";
import User from "./Components/user";

class App extends Component {
  constructor(props) {
    super(...props);
    this.state = {};
  }

  render() {
    const labelingprops = {};
    const loginProps = {};
    const signupProps = {};
    return (
      <BrowserRouter>
        <div>
          <Nav />
          <Switch>
            {/* Home related routes */}
            <Route exact path="/" render={props => <Home props={props} />} />
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
      </BrowserRouter>
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
    session: state.auth.session,
    labeling: labeling,
    user: user
  };
};
const mapDispatchToProps = dispatch => {
  return { dispatch };
};

App = connect(mapStateToProps, mapDispatchToProps)(App);
export default App;
