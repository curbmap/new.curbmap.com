import React, { Component } from "react";
import "./footer.scss";
import hfla from "./logo-hfla.svg";
import Modal from "react-modal";

const styles = {
  modalStyle: {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(60, 60, 130, 0.75)"
    },
    content: {
      position: "relative",
      top: "100px",
      left: "2vw",
      border: "0px solid #888",
      background: "rgba(190,190,190,1)",
      width: window.innerWidth > 800 ? "60%" : "85vw",
      height: "60%",
      overflow: "auto",
      WebkitOverflowScrolling: "touch",
      borderRadius: "8px",
      outline: "none",
      padding: "20px"
    }
  }
};

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wordy: true,
      showAbout: false,
      showContact: false
    };
    this.showAbout = this.showAbout.bind(this);
    this.showContact = this.showContact.bind(this);
    this.closeModals = this.closeModals.bind(this);
  }
  showAbout() {
    this.setState({ showAbout: true, showContact: false });
  }
  showContact() {
    this.setState({ showAbout: false, showContact: true });
  }
  closeModals() {
    this.setState({ showAbout: false, showContact: false });
  }
  render() {
    return (
      <div className="footer-holder">
        <Modal
          isOpen={this.state.showAbout}
          style={styles.modalStyle}
          contentLabel="Modal"
        >
          <div className="titleleft">About curbmap</div>
          <div className="closeright bluelink" onClick={this.closeModals}>
            x
          </div>
          <div className="bodyclear">
            Curbmap is not a company, it is a volunteer group of people who are
            involved with <a href="https://hackforla.org">Hack For LA</a>, the
            civic hacking group affiliated with{" "}
            <a href="https://www.codeforamerica.org/">Code for America</a>.<br />
          </div>
          <p>
            We are trying to reduce a driver's risk of parking at a curb on the
            street where it is illegal to park. The goal for curbmap is to
            crowdsource an ever-updating map of the parking restrictions
            everywhere around you.<br />
            Having up-to-date maps of parking serves two purposes:
            <ol>
              <li>
                It helps us inform other drivers so they might avoid tickets
              </li>
              <li>
                It allows a driver to look for parking before even stepping out
                of the door.
              </li>
            </ol>
          </p>
        </Modal>
        <Modal
          isOpen={this.state.showContact}
          style={styles.modalStyle}
          contentLabel="Modal"
        >
          <div className="titleleft">About curbmap</div>
          <div className="closeright bluelink" onClick={this.closeModals}>
            x
          </div>
          <div className="bodyclear">
            <p>For now, contact us at: eli.j.selkin@gmail.com</p>
          </div>
        </Modal>
        <div className="footer">
          <div className="footer-left">
            <div className="lightbluelink" onClick={this.showContact}>
              Contact us
            </div>
            <div className="lightbluelink" onClick={this.showAbout}>
              About us
            </div>
          </div>
          <div className="footer-organization">
            <span className="wordy">
              {"Curbmap was fostered with support from "}
            </span>
            <a href="http://hackforla.org">
              <img
                src={hfla}
                height={45}
                style={{ verticalAlign: "middle" }}
                alt="Hack for LA logo"
              />
            </a>
          </div>
        </div>
        <div className="footer-base">
          &copy; 2018 curbmap.{" "}
          <a href="https://curbmap.com/terms"> Terms &amp; Conditions</a>
        </div>
      </div>
    );
  }
}

export default Footer;
