import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import superagent from "superagent";
import { connect } from "react-redux";
import logo from "./logo.svg";
import { loggedIn } from "../../Actions/auth.action.creators";
import { withFormik } from "formik";
import "./login.scss";

let HOST_AUTH = "https://curbmap.com";
// if (process.env.REACT_APP_STAGE === "dev") {
//   HOST_AUTH = "http://localhost:8080";
// }

// component function
const LoginForm = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting
}) => (
  <form onSubmit={handleSubmit}>
    <input
      type="text"
      name="email"
      placeholder="username or email address"
      autoCapitalize="none"
      autoCorrect={false}
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.email}
    />
    {touched.email &&
      errors.email && <div className="error-label">{errors.email}</div>}
    <input
      type="password"
      name="password"
      placeholder="password"
      autoComplete="off"
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.password}
    />
    {touched.password &&
      errors.password && <div className="error-label">{errors.password}</div>}
    <button type="submit" disabled={isSubmitting}>
      Login
    </button>
  </form>
);

const FormikLoginForm = withFormik({
  // Transform outer props into form values
  mapPropsToValues: props => ({ email: "", password: "" }),
  // Add a custom validation function (this can be async too!)
  validate: (values, props) => {
    const errors = {};
    if (!values.email) {
      errors.email = "Required";
    } else if ( values.email.includes("@") &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Invalid email address";
    }
    if (!values.password) {
      errors.password = "Required";
    } else if (values.password.length < 9 || values.password.length > 60) {
      errors.password = "Password is between 9 and 60 characters";
    }
    return errors;
  },
  handleSubmit: (values, props) => {
    props.props.handleSubmit(values);
  }
})(LoginForm);

class Login extends Component {
  constructor(props) {
    super(props);
    this.formHandler = this.formHandler.bind(this);
    this.state = {
      username: "",
      password: ""
    };
  }

  formHandler(evt) {
    superagent
      .post(HOST_AUTH + "/login")
      .send({ username: evt.email, password: evt.password })
      .set("Content-Type", "application/x-www-form-urlencoded")
      .end((err, res) => {
        if (err) {
          alert("Error in sending password. Try again in a minute.");
          return;
        }
        if (res.body.success === 1) {
          // emit the action
          this.props.dispatch(loggedIn(res.body));
          this.props.history.push("/");
          return;
        }
        alert("There was an error signing in, check your password.");
      });
  }
  render() {
    return (
      <div className="login-holder">
        <div className="login">
          <img src={logo} alt="logo for curbmap" className="login-logo" />
          <br />
          <h2 className="login-header">Welcome,</h2>
          <h4 className="login-header">and log in to curbmap.</h4>
          <FormikLoginForm handleSubmit={this.formHandler} />
        </div>
      </div>
    );
  }
}
Login = connect()(Login);

export default withRouter(Login);
