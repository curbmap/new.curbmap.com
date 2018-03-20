import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import superagent from "superagent";
import { connect } from "react-redux";
import logo from "./logo.svg";
import { loggedIn } from "../../Actions/auth.action.creators";
import { withFormik } from "formik";
import "./signup.scss";
import ReactGA from 'react-ga';

let HOST_AUTH = "https://curbmap.com";
// if (process.env.REACT_APP_STAGE === "dev") {
//   HOST_AUTH = "http://localhost:8080";
// }

// component function
const SignupForm = ({
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
      type="username"
      name="username"
      placeholder="username"
      autoComplete="username"
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.username}
    />
    {touched.username &&
      errors.username && <div className="error-label">{errors.username}</div>}
    <input
      type="email"
      name="email"
      placeholder="email address"
      autoComplete="email"
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
    <input
      type="password"
      name="retype"
      placeholder="retype your password"
      autoComplete="off"
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.retype}
    />
    {touched.retype &&
      errors.retype && <div className="error-label">{errors.retype}</div>}
    {errors.form && <div className="error-label">{errors.form}</div>}
    <button type="submit" disabled={isSubmitting}>
      Signup
    </button>
  </form>
);

const FormikSignupForm = withFormik({
  // Transform outer props into form values
  mapPropsToValues: props => ({
    email: "",
    password: "",
    retype: "",
    username: ""
  }),
  // Add a custom validation function (this can be async too!)
  validate: (values, props) => {
    const errors = {};
    if (!values.email) {
      errors.email = "Required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Sorry, but the way we check emails requires one specifically formatted like: jane@something.com";
    }
    if (!values.password) {
      errors.password = "Required";
    } else if (values.password.length < 9 || values.password.length > 40) {
      errors.password = "Password is between 9 and 40 characters";
    } else if (!/[!@#$%^&*)(<>+=._]+/g.test(values.password)) {
      errors.password =
        "Password must contain a special character from: !@#$%^&*)(<>+=._";
    } else if (!/[A-Z]+/g.test(values.password)) {
      errors.password = "Password must contain a capital letter";
    } else if (!/[a-z]+/g.test(values.password)) {
      errors.password = "Password must contain a lowecase letter";
    } else if (!/[0-9]+/g.test(values.password)) {
      errors.password = "Password must contain a number";
    }
    if (!values.retype) {
      errors.retype = "Required";
    } else if (values.retype !== values.password) {
      errors.retype = "Retyped password should be the same as the password";
    }
    return errors;
  },
  handleSubmit: async (values, props) => {
    try {
      let submitting = await props.props.handleSubmit(values);
      console.log("SUBMITTING:", submitting);
      switch (submitting) {
        case -500:
          props.setErrors({
            form: "Could not submit signup at this moment, try again in a bit."
          });
          break;
        case -1:
          props.setErrors({
            username: "Username was already used, please choose another."
          });
          break;
        case -2:
          props.setErrors({
            email:
              "Email was already used, please check that email for confirmation authorization."
          });
          break;
        case -3:
          props.setErrors({
            password:
              "Check password criteria. Between 9-40 characters. One Special. One Upper case. One lowercase. One number."
          });
          break;
        case -3:
          props.setErrors({
            email: "Check e-mail, it may not have been entered correctly."
          });
          break;
        default:
          props.setErrors({
            form:
              "Something else happened in the form. We're not sure what went wrong."
          });
          break;
      }
    } catch (error) {}
    props.setSubmitting(false);
  }
})(SignupForm);

class Signup extends Component {
  constructor(props) {
    super(props);
    this.formHandler = this.formHandler.bind(this);
    this.state = {
      username: "",
      password: ""
    };
  }
  componentDidMount() {
    ReactGA.initialize('UA-100333954-1');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  async formHandler(evt) {
    console.log(evt);
    try {
      let res = await superagent
        .post(HOST_AUTH + "/signup")
        .send({
          username: evt.username,
          password: evt.password,
          email: evt.email
        })
        .set("Content-Type", "application/x-www-form-urlencoded");
      console.log(res);
      if (res.body.success === 1) {
        this.props.history.push("/login");
        return 1;
      } else {
        return res.body.success;
      }
    } catch (err) {
      return -500;
    }
  }
  render() {
    return (
      <div className="signup-holder">
        <div className="signup">
          <img src={logo} alt="logo for curbmap" className="signup-logo" />
          <br />
          <h2 className="signup-header">Welcome,</h2>
          <h4 className="signup-header">and sign up for curbmap.</h4>
          <FormikSignupForm handleSubmit={this.formHandler} />
        </div>
      </div>
    );
  }
}
Signup = connect()(Signup);

export default withRouter(Signup);
