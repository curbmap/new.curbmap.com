import React, { Component } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody
} from "react-accessible-accordion";
import clap from "./clap.svg";
import frown from "./frown.svg";
import "../../../node_modules/react-accessible-accordion/dist/react-accessible-accordion.css";

import blogs from "./blogs";
import "./blog.css";

const getLocalDateFor = function(date) {
  let realDate = new Date(0);
  realDate.setUTCSeconds(date);
  var options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };
  return `${realDate.toLocaleDateString("en-US", options)}`;
};
const makePosts = function(blogs) {
  let bloglist = [];
  for (let blogpost of blogs) {
    console.log(blogpost);
    let blog_item = (
      <AccordionItem>
        <AccordionItemTitle className="accordion__title accordion__title--animated">
          <h3 className=" u-position-relative u-margin-bottom-s">
            <img
              src={blogpost.image}
              alt={blogpost.altimage}
              className="blog-image"
            />{" "}
            {blogpost.title}
            <div className="accordion__date" role="presentation">
              {getLocalDateFor(blogpost.date)}
            </div>
            <div className="accordion__arrow" role="presentation" />
          </h3>
        </AccordionItemTitle>
        <div className="block font-medium">
          {blogpost.introparagraph + "..."}
        </div>
        <AccordionItemBody>{blogpost.content}</AccordionItemBody>
        <div className="block font-medium">
          <div className="u-left"><img src={clap} width={30} /></div>&nbsp;
          <div className="u-right"><img src={frown} width={30} /></div>
        </div>
      </AccordionItem>
    );
    bloglist.push(blog_item);
  }
  return bloglist;
};

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blogposts: makePosts(blogs)
    };
  }
  render() {
    return (
      <div className="blog-space">
        <h4>{"Welcome to the participation hub"}</h4>
        <Accordion>{this.state.blogposts}</Accordion>
      </div>
    );
  }
}
export default Home;
