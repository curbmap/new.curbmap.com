import React, { Component } from "react";
const styles = {
  body: {
    padding: 20,
  }
};

class News extends Component {
  render() {
    return (
      <div style={styles.body}>
        <h4>{"Home / News"}</h4>
      </div>
    );
  }
}
export default News;
