import React from "react";
import "./messages.css";
import temporary from "./temporary.svg";
import car from "./car.svg";

const messages = {
  "hate parking": (
    <div className="message">
      <div className="heading">Hate Parking? We do to!</div>
      <div className="background">
        <img className="image" src={temporary} alt="a temporary parking sign"/>
        <div className="body">
          We are always trying to find new ways to make your life easier finding
          parking! Those pesky temporary no parking signs always seem to pop up 
          at the most inconvenient times. We'll try to warn you about them before 
          you think you've found a space.
        </div>
      </div>
    </div>
  ),
  "less of a chore": (
    <div className="message">
      <div className="heading">Help your friends when they come visit!</div>
      <div className="background">
        <img className="image" src={car} alt="a tilted car" />
        <div className="body">
          We are always trying to find new ways to make your life easier finding
          parking!
        </div>
      </div>
    </div>
  )
};

export default messages;
