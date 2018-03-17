import React from "react";
import "./messages.scss";
import temporary from "./temporary.svg";
import car from "./car.svg";
import sticky from "./sticky.svg";

const messages = {
  "hate parking": (
    <div className="message">
      <div className="message-image-holder">
        <img
          className="message-image"
          src={temporary}
          alt="a temporary parking sign"
        />
      </div>
      <div className="message-body-holder">
        <div className="message-heading">Hate Parking? We do to!</div>
        <div className="message-body">
          We are always trying to find new ways to make your life easier finding
          parking! Those pesky temporary no parking signs always seem to pop up
          at the most inconvenient times. We'll try to warn you about them
          before you think you've found a space.
        </div>
      </div>
    </div>
  ),
  "less of a chore": (
    <div className="message">
      <div className="message-image-holder">
        <img className="message-image" src={car} alt="a tilted car" />
      </div>
      <div className="message-body-holder">
        <div className="message-heading">
          Help your friends when they come visit!
        </div>
        <div className="message-body">
          We are always trying to find new ways to make your life easier finding
          parking!
        </div>
      </div>
    </div>
  ),
  "participate in labeling": (
    <div className="message">
      <div className="message-image-holder">
        <img className="message-image" src={sticky} alt="a sticky note" />
      </div>
      <div className="message-body-holder">
      <div className="message-heading">
          Label things, it's fun!
        </div>      
        <div className="message-body">
          Label some parking signs, get points, and make the world a better
          place!
        </div>
      </div>
    </div>
  )
};

export default messages;
