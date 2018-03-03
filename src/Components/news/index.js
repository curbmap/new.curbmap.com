import React, { Component } from "react";
import "./news.css";
const styles = {
  body: {
    padding: 20,
  }
};

class News extends Component {
  render() {
    return (
      <div className="news-holder">
        <h4>{"Home / News"}</h4>
      </div>
    );
  }
}
export default News;
