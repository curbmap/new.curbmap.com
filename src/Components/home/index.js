import React, { Component } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody
} from "react-accessible-accordion";
import clap from "./clap.svg";
import frown from "./frown.svg";
import "./react-accessible-accordion.css";
import ReactGA from "react-ga";
import blogs from "./blogs";
import downtriangle from "./downtriangle.svg";
import "./blog.scss";

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
    let blog_item = (
      <AccordionItem>
        <AccordionItemTitle className="accordion__title">
          <div className="accordion__img">
            <img
              src={blogpost.image}
              alt={blogpost.altimage}
              className="blog-image"
            />
          </div>
          <div className="accordion__text-title">{blogpost.title}</div>
          <div className="accordion__date" role="presentation">
            {getLocalDateFor(blogpost.date)}
          </div>
          <div className="accordion__triangle" role="presentation"><img className="image__triangle" src={downtriangle} /></div>
        </AccordionItemTitle>
        <div className="block font-medium">
          {blogpost.introparagraph + "..."}
        </div>
        <AccordionItemBody>{blogpost.content}</AccordionItemBody>
        <div className="block font-medium">
          <div className="u-left">
            <img src={clap} width={30} />
          </div>&nbsp;
          <div className="u-right">
            <img src={frown} width={30} />
          </div>
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
  componentDidMount() {
    ReactGA.initialize("UA-100333954-1");
    ReactGA.pageview(window.location.pathname + window.location.search);
  }
  render() {
    return (
      <div className="blog-space">
        {/* <div className="welcome">{"Welcome to the participation hub"}</div> */}
        <Accordion>{this.state.blogposts}</Accordion>
      </div>
    );
  }
}
export default Home;
