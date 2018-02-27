import React, { Component } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody
} from "react-accessible-accordion";
import "../../../node_modules/react-accessible-accordion/dist/react-accessible-accordion.css";

import blogs from "./blogs";
import "./blog.css";
/*
<h3 className=" u-position-relative u-margin-bottom-s">
                        Run the demo
                        <div className="accordion__arrow" role="presentation" />
                    </h3>
                    <div>To have an easy play around</div>
                </AccordionItemTitle>
                <div className="block">
                    This block fits in between the title and the body.
                </div>
                <AccordionItemBody>
                    <p>
                        Everything mentioned in the installation process should
                        already be done.
                    </p>
                    <p>
                        # Make sure you use the right node version.<br />
                        nvm use<br />
                        # Start the server and the development tools.<br />
                        npm run start-demo
                    </p>
                </AccordionItemBody>
*/
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
            <div className="accordion__arrow" role="presentation" />
          </h3>
        </AccordionItemTitle>
        <div className="block">{blogpost.introparagraph+"..."}</div>
        <AccordionItemBody>{blogpost.content}</AccordionItemBody>
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
