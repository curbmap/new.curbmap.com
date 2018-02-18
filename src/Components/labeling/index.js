import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LabelingContent from "./LabelingContent.js";

const request = require("superagent");


class Labeling extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image:
        "https://curbmap.com:50003/uploads/03673a00-ef23-11e7-903b-8d9a8c07e4d0-1517445504563-85632QW7+RMJC-102.443206787109.jpg"
    };

    this.save = this.save.bind(this);
    this.next = this.save.bind(this);
  }
  save(state) {
    console.log(state);
  }
  previous() {

  }
  next() {

  }

  getImage() {
    request
      .get("https://curbmap.com:50003/getPhoto")
      .set("session", this.props.session)
      .set("username", this.props.username)
      .set("Accept-Encoding", "deflate, gzip;q=1.0, *;q=0.5")
      .then(this.gotImage);
  }
  gotImage(res) {
    console.log(res);
  }
  render() {
    return (
      <div onKeyPress={e => this.handleKeyPress(e)}>
          <LabelingContent
            image={this.state.image}
            previous={this.previous}
            next={this.next}
            save={this.save}
          />
      </div>
    );
  }
}
const mapStateToProps = state => {
  console.log("LABELING MAPSTATETOPROPS", state);
  return {
    logged_in: state.logged_in,
    signed_up: state.signed_up,
    session: state.session
  };
};
const mapDispatchToProps = dispatch => {
  console.log("LABELING MAPDISPATCHTOPROPS", dispatch);
  return {
  };
};

Labeling = connect(mapStateToProps, mapDispatchToProps)(Labeling);
export default withRouter(Labeling);
