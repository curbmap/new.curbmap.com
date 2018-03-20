import React from "react"; // for JSX and importing files
import questions from "./questions.svg";
import logo from "./logo.svg";
import form from "./form.svg";
const blogs = [
  {
    date: 1521435363,
    image: form,
    altimage: "form to be filled out",
    title: "We want your feedback.",
    introparagraph:
      "We need to know if the community wants to revolutionize parking and access to the restriction information.",
    content: [
      <p>
        {
          "Participate in our new survey to get great feedback from the people who really matter. You!"
        }
      </p>,
      <p>
        {window.innerWidth > 800 && <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSfgMu5CEwPSyCnI9kr2nSX6ZzFaKxp4uuRIX5IDaVd3CKUqbA/viewform?embedded=true" width="600" height="500" frameBorder="0" marginHeight="0" marginWidth="0">Loading...</iframe>}
        {window.innerWidth <= 800 && <a href="https://goo.gl/forms/5lDAflUDF90t0ED23"><div  className="bluelink">Get the survery here</div></a>}
      </p>
    ]
  },
  {
    date: 1519716712,
    image: logo,
    altimage: "our logo",
    title: "We are trying to become experts on parking so you don't have to.",
    introparagraph:
      "We, at curbmap, are introducing a new way to help your future self, support your community, and enhance the visits of people to your community in one step. Together we can simplify the way you look for parking and we can improve visitors' experiences when they come to your community",
    content: [
      <p>
        {
          "Imagine you are traveling somewhere new. Whether you are site-seeing, visiting friends, starting a new job, or moving to your new apartment, it would be nice to know where you can park to reduce the chance you'd get a ticket. I remember back when I started a new job in Los Angeles. By the end of the first month, I'd gotten a ticket on one street and been towed from another. These experiences are not ones I'd like to relive. But, who do you ask about parking rules? How do you guide yourself to those locations that are suggested? Will the person you ask let you know all the options, so you don't first have to go searching and miss your appointment?"
        }
      </p>,
      <p>
        {
          "Now imagine that one of your friends is coming to visit you. Did you let that person know where to park before they set out? Did you give good enough directions so that she could find what you were talking about when you made your suggestion? These potential pitfalls come in many shapes, sizes, and perspectives."
        }
      </p>,
      <p>
        {
          "I know what you're thinking. I'll pin the best location on a map and send that exact location to my friend, colleague, etc. Why don't people do that already? Maybe we imagine that living in a city (or any place with rules), comes at a cost that everyone must pay, equally."
        }
      </p>,
      <div>
        <p className="hred">{"What if we could change all that? "}</p>
        <p>
          {
            "What if you could be a part of the solution that makes it better for everyone who has to pay attention to the rules? On the participation hub for curbmap, you will find things like labeling, which helps us build autonomous systems to verify parking restrictions from photos of signs. In the future, we'll have more than just labeling and classification, but for now, the labeling process is instrumental to building a knowledgeable system."
          }
        </p>
      </div>,
      <p>
        {
          "It's revolutionary to think that, maybe you could scan a map near your appointment and find all the curbs that allow you to park for as long as you expect your meeting to last. Just give the connected apps some specifics about your meeting and you'd be good to go!"
        }
      </p>,
      <div>
        <p className="hblue">{"Happy parking to your future self!"}</p>
      </div>
    ]
  }
];
export default blogs;
