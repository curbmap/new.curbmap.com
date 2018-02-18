import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import superagent from "superagent";
import styled from "styled-components";
import { connect } from "react-redux";
import logo from "./logo.svg";
import { LOGGED_IN, loggedIn } from "../../Actions/auth.action.creators";
import "./login.css";

const ImgLogo = styled.img`
  width: 25%;
`;
const DivLogin = styled.div`
  width: 40%;
  margin: 20px;
  padding: 10px;
  text-align: center;
  background-color: white;
  border-radius: 5px;
  box-shadow: 1px 1px 8px 5px #4db4d1;
  min-width: 500px;
`;

const Button = styled.button`
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 10px;
  font-family: Poppins-Regular;
  font-weight: bold;
  font-size: 14pt;
`;
const styles = {
  body: {
    padding: 20
  }
};
const checkpassword = function(passValue) {
  if (passValue.length < 9 || passValue.length > 30) {
    return false;
  }
  return true;
};
class Login extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.changePassword = this.changePassword.bind(this);
    this.changeUsername = this.changeUsername.bind(this);
    this.formHandler = this.formHandler.bind(this);
    this.state = {
      username: "",
      password: "",
      usernameClass: "correct",
      passwordClass: "correct",
      altPassword: "password is looking good!"
    };
  }
  changeUsername(evt) {
    this.setState({ username: evt.target.value });
  }

  changePassword(evt) {
    this.refs.password.classList.remove("incorrect");
    this.refs.password.classList.add("correct");
    this.setState({
      altPassword: "Your password is looking correct.",
      password: evt.target.value
    });
    if (!checkpassword(evt.target.value)) {
      this.setState({
        altPassword: "The password you entered so far is probably not correct."
      });
      this.refs.password.classList.remove("correct");
      this.refs.password.classList.add("incorrect");
    }
  }

  formHandler(evt) {
    superagent
      .post("https://curbmap.com/login")
      .send({ username: this.state.username, password: this.state.password })
      .set("Content-Type", "application/x-www-form-urlencoded")
      .end((err, res) => {
        if (err) {
          alert("Error in sending password. Try again in a minute.");
        }
        if (res.body.success == 1) {
          // emit the action
          this.props.dispatch(loggedIn(res.body));
          this.props.history.push("/");
          return;
        }
        alert("There was an error signing in, check your password.");
      });
    evt.preventDefault();
  }
  render() {
    return (
      <div style={styles.body}>
        <DivLogin>
          <ImgLogo src={logo} />
          <br />
          <form onSubmit={this.formHandler}>
            <input
              placeholder="username"
              value={this.state.username}
              onChange={this.changeUsername}
              className={this.state.usernameClass}
              ref="username"
            />
            <br />
            <input
              type="password"
              placeholder="password"
              value={this.state.password}
              onChange={this.changePassword}
              className={this.state.passwordClass}
              alt={this.state.altPassword}
              ref="password"
            />
            <br />
            <Button type="submit" value="Submit" id="submit">
              Login
            </Button>
          </form>
        </DivLogin>
      </div>
    );
  }
}
Login = connect()(Login);

export default withRouter(Login);
