import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import superagent from "superagent";
import { updateImage } from "../../Actions/image.action.creators";
import LabelingContent from "./LabelingContent.js";
let HOST_AUTH = "https://curbmap.com";
let HOST_RES = "https://curbmap.com:50003";
if (process.env.REACT_APP_STAGE === "dev") {
  HOST_AUTH = "http://localhost:8080";
  HOST_RES = "http://localhost:8081";
}
class Labeling extends Component {
  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
    this.next = this.save.bind(this);
    this.gotImage = this.gotImage.bind(this);
  }
  save(state) {
    console.log(state);
  }
  previous() {}
  next() {}
  componentWillMount() {
    this.getImage();
  }
  getImage() {
    superagent
      .post(HOST_RES + "/getPhoto/")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Access-Control-Allow-Origin", "*")
      .set("session", this.props.session)
      .set("username", this.props.username)
      .then(this.gotImage)
      .catch(err => {
        console.log("ERR", err);
      });
  }
  gotImage(res) {
    this.props.dispatch(updateImage(res.body));
  }
  render() {
    console.log("HERE IN RENDER LABELING");
    return (
      <div onKeyPress={e => this.handleKeyPress(e)}>
        <LabelingContent
          previous={this.previous}
          next={this.next}
          save={this.save}
          image={this.props.image}
          imageid={this.props.imageid}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  console.log("LABELING CONTENT STATE", state);
  let newProps = {};
  newProps.username = state.auth.username;
  newProps.email = state.auth.email;
  newProps.session = state.auth.session;
  newProps.logged_in = state.auth.success === 1;
  newProps.signed_up = false;
  newProps.image = state.updateImage.image;
  newProps.imageid = state.updateImage.imageid;
  console.log("NEW PROPS", newProps)
  return newProps;
};
const mapDispatchToProps = dispatch => {
  return {
    dispatch
  };
};

Labeling = connect(mapStateToProps, mapDispatchToProps)(Labeling);
export default withRouter(Labeling);
