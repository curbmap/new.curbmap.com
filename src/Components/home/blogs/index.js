import React from "react"; // for JSX and importing files
import questions from "./questions.svg";
import logo from "./logo.svg";

const blogs = [
  {
    date: 1519716712,
    image: logo,
    altimage: "our logo",
    title: "We are trying to become experts on parking so you don't have to.",
    introparagraph: "I hate finding parking as much as the next person, but ",
    content: [
      <p>{"We'd love to hear about your questions p1"}</p>,
      <p>{"We'd love to hear about your questions p2"}</p>
    ]
  }
];
export default blogs;
