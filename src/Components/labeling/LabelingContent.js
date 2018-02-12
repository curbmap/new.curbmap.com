import React, { Component } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import styled from "styled-components";
import NativeListener from "react-native-listener";
import { Stage, Layer, Rect, Group, Line } from "react-konva";
import Konva from "konva";
import Modal from "react-modal";
import LabelBox from "./LabelBox";
import Img from "./Img";
import labels from "../labeling/Labels";
import transparentPng from './transparent.png';

function findBox(id, boxes) {
  for (let i = 0; i < boxes.length; i += 1) {
    if (boxes[i].id === id) {
      return i;
    }
  }
  return -1;
}

const DivImg = styled.div`
  border: 1px solid black;
  width: 70vw;
  height: 100vh;
  float: left;
  align-content: center;
  align: center;
  textalign: center;
  padding: 0px;
  margin: 0px;
`;

const DivLabels = styled.div`
  border: 1px solid black;
  width: 25vw;
  height: 59.5vh;
  float: left;
`;
const DivRestrs = styled.div`
  border: 1px solid black;
  width: 25vw;
  height: 40vh;
  float: left;
`;

const Select = styled.select`
  -webkit-user-select: none;
  -moz-user-select: none;
  -webkit-padding-end: 25px;
  -moz-padding-end: 25px;
  -webkit-padding-start: 5px;
  -moz-padding-start: 5px;
  background-color: #707575;
  background-position: center right;
  background-repeat: no-repeat;
  border: 1px solid #aaa;
  border-radius: 5px;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
  color: #fff;
  font-size: inherit;
  margin: 0;
  overflow: hidden;
  padding-top: 3px;
  padding-bottom: 3px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const ButtonOk = styled.button`
  position: absolute;
  left: 20px;
  bottom: 20px;
  width: 150px;
  height: 100px;
  color: white;
  font-size: 15pt;
  background-color: green;
  border-radius: 8px;
`;
const ButtonCancel = styled.button`
  position: absolute;
  right: 20px;
  bottom: 20px;
  width: 150px;
  height: 100px;
  color: white;
  font-size: 15pt;
  background-color: gray;
  border-radius: 8px;
`;
const styles = {
  modalStyle: {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(120, 60, 120, 0.75)"
    },
    content: {
      position: "absolute",
      top: "100px",
      left: "100px",
      border: "5px solid #888",
      background: "#ccc",
      width: "500px",
      overflow: "auto",
      WebkitOverflowScrolling: "touch",
      borderRadius: "8px",
      outline: "none",
      padding: "20px"
    }
  }
};

class LabelingContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      imagewidth: 0,
      imageheight: 0,
      originalimagewidth: 0,
      initial: 0,
      stage: null,
      layer: null,
      div: null,
      drawingBox: false,
      boxes: [
        {
          x: 0.2,
          y: 0.2,
          width: 0.1,
          height: 0.1,
          type: labels.permament_permit_sign,
          id: 0
        }
      ],
      labels: [],
      restrs: [],
      movingRect: null,
      mouseLocation: {
        x: null,
        y: null
      },
      lastMouseLocation: {
        x: null,
        y: null
      },
      iddoubleclicked: null,
      showModal: false,
      selectType: null,
      windowwidth: 0,
      windowheight: 0
    };
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.getImageSize = this.getImageSize.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  // Probably slows performance and may not be correct considering we are not using the real DOM
  componentDidMount() {
    this.updateImage();
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
    this.updateCanvas(0);
  }
  componentWillUpdate() {
    this.updateCanvas(this.state.initial);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }
  updateWindowDimensions() {
    this.updateImage();
    console.log(this.state.image.width);
    let oldh = this.state.windowheight;
    let oldw = this.state.windowwidth;
    let ratioh = window.innerHeight/oldh;
    let ratiow = window.innerWidth/oldw;
    let imgratio = this.state.imagewidth > this.state.imageheight? ratiow : ratioh;
    this.setState({
      windowwidth: window.innerWidth,
      windowheight: window.innerHeight,
    });
    console.log(this.state.image);
    console.log("running update canvas -- RESIZE");
    this.updateCanvas();
    this.drawRects();
  }
  handleDoubleClickFromRect(event, id) {
    this.setState({
      iddoubleclicked: id,
      showModal: true
    });
  }

  getImageSize(evt) {
    console.log("image size", evt);
    this.setState({ imagewidth: evt.width, imageheight: evt.height, originalimagewidth: evt.width });
    this.updateCanvas();
  }

  handleDoubleClick(event) {
    console.log("double not content", event);
    if (this.state.iddoubleclicked === null) {
      console.log(this.state);
      const { x, y } = this.state.stageRef.getPointerPosition();
      let newBoxes = this.state.boxes;
      newBoxes.push({
        x: x / this.state.imagewidth, // use proportions
        y: y / this.state.imageheight,
        width: 30 / this.state.imagewidth,
        height: 30 / this.state.imagewidth,
        type: labels.permanent_no_parking_sign,
        id: newBoxes[newBoxes.length - 1].id + 1
      });
      console.log(newBoxes);
      this.setState({
        lastMouseLocation: this.state.mouseLocation,
        mouseLocation: {
          x,
          y
        },
        boxes: newBoxes,
        iddoubleclicked: newBoxes[newBoxes.length - 1].id,
        showModal: true
      });
      this.drawRects();
      this.updateCanvas();
      this.forceUpdate();
    }
  }

  getMouseLocation() {
    return this.state.mouseLocation;
  }

  handleMouseMove(event) {
    // update location
    this.state.stageRef = event.currentTarget;
    const { x, y } = event.currentTarget.getPointerPosition();
    this.setState({
      lastMouseLocation: this.state.mouseLocation,
      mouseLocation: {
        x,
        y
      }
    });
    if (this.state.movingRect != null) {
      // we have an object to move
      this.handleRectMove(this.state.movingRect);
    }
  }

  changeDrawingBoxState(drawingState) {
    this.setState({
      drawingBox: drawingState
    });
  }

  drawRects() {
    console.log("drawRects");
    let values = [];
    console.log(this.state.imagewidth);
    this.state.boxes.forEach(box => {
      console.log("draw box", this.state.imageheight);
      console.log(box.type);
      console.log(box.x * this.state.imagewidth);
      values.push(
        <LabelBox
          x={box.x * this.state.imagewidth}
          y={box.y * this.state.imageheight}
          type={box.type}
          width={box.width * this.state.imagewidth}
          height={box.height * this.state.imageheight}
          movingRect={this.movingRect.bind(this)}
          stoppedMovingRect={this.stoppedMovingRect.bind(this)}
          doubleClick={this.handleDoubleClickFromRect.bind(this)}
          style={{
            zIndex: 100
          }}
          id={box.id}
        />
      );
    });
    console.log(values);
    this.state.labelBoxes = values;
    console.log(this.state.labelBoxes);
    this.updateCanvas();
    this.forceUpdate();
  }

  handleMouseUp(evt) {
    for (const box of this.state.boxes) {
      this.stoppedMovingRect(this.state.movingRect);
    }
  }

  movingRect(id) {
    console.log(id);
    this.setState({ movingRect: id });
  }

  stoppedMovingRect(id) {
    this.setState({
      movingRect: null,
      mouseInTopLeftCorner: false,
      mouseInBottomRightCorner: false
    });
  }

  // Keep track in this parent what the state of the underlying boxes are!
  // So that we can return that data to the server later!
  handleRectMove(id) {
    const copyBoxes = this.state.boxes.slice();
    const idx = findBox(id, copyBoxes);
    const groupObj = this.state.stageRef.find(`#${id}`);
    const boxObj = groupObj[0].children[0];
    if (boxObj != null && boxObj != undefined && idx >= 0) {
      const x = boxObj.getX() * 1.0 / this.state.imagewidth;
      const y = boxObj.getY() * 1.0 / this.state.imageheight;
      const w = boxObj.getWidth() * 1.0 / this.state.imagewidth;
      const h = boxObj.getHeight() * 1.0 / this.state.imageheight;
      let newx = this.state.mouseLocation.x / this.state.imagewidth;
      let newy = this.state.mouseLocation.y / this.state.imageheight;
      let lastx = this.state.lastMouseLocation.x / this.state.imagewidth;
      let lasty = this.state.lastMouseLocation.y / this.state.imageheight;
      let tl = false;
      let br = false;
      // Also get the position of
      if (!isNaN(x) && !isNaN(y) && !isNaN(w)) {
        if (
          (x > newx - 7 / this.state.imagewidth &&
            x < newx + 7 / this.state.imagewidth &&
            y > newy - 7 / this.state.imageheight &&
            y < newy + 7 / this.state.imageheight) ||
          this.state.mouseInTopLeftCorner
        ) {
          // touching topLeft corner
          console.log("touching tl");
          tl = true;
          this.setState({ mouseInTopLeftCorner: true });
        }
        if (
          (x + w > newx - 7 / this.state.imagewidth &&
            x + w < newx + 7 / this.state.imagewidth &&
            y + h > newy - 7 / this.state.imageheight &&
            y + h < newy + 7 / this.state.imageheight) ||
          this.state.mouseInBottomRightCorner
        ) {
          console.log("touching br");
          br = true;
          this.setState({ mouseInBottomRightCorner: true });
        }
        if (!br && !tl) {
          const distX = newx - lastx;
          const distY = newy - lasty;
          console.log("not touching corners");
          console.log(this.state.imageheight);
          if (copyBoxes[idx].x + distX > 1 / this.state.imagewidth) {
            if (newx < 1 - copyBoxes[idx].width - 1 / this.state.imagewidth) {
              copyBoxes[idx].x += distX;
              console.log("X> with distX:", copyBoxes[idx].x, distX);
            } else if (
              newx >=
              1 - copyBoxes[idx].width - 1 / this.state.imagewidth
            ) {
              console.log(
                "XXX:",
                1 - copyBoxes[idx].width - 1 / this.state.imagewidth
              );
              copyBoxes[idx].x =
                1 - copyBoxes[idx].width - 1 / this.state.imagewidth;
              console.log("X> imagewidth:", copyBoxes[idx].x);
            }
          } else {
            copyBoxes[idx].x = 1 / this.state.imagewidth;
          }
          if (copyBoxes[idx].y + distY > 1 / this.state.imageheight) {
            if (
              newy < 1 - copyBoxes[idx].height - 1/this.state.imageheight 
            ) {
              copyBoxes[idx].y += distY;
            } else if (
              newy >=
              1 - copyBoxes[idx].height - 1/ this.state.imageheight 
            ) {
              copyBoxes[idx].y = 1 - copyBoxes[idx].height - 1/ this.state.imageheight;
            }
          } else {
            copyBoxes[idx].y = 1 / this.state.imageheight;
          }
          this.setState({
            boxes: copyBoxes
          });
          this.drawRects();
          this.updateCanvas();
          this.forceUpdate();
        } else if (tl) {
          console.log("in top left drag");
          // move x y to mouse position and change w/h
          let distx = 0;
          let disty = 0;
          let neww = w;
          let newh = h;
          if (
            newx > 1/this.state.imagewidth &&
            newx <= (x + w) - 2.0/this.state.imagewidth &&
            Math.abs(newx - x) > 1/this.state.imagewidth
          ) {
            // the top left can move to 1 or 2 pixels left of the right side (otherwise it's not a box)
            distx = x - newx;
            neww += distx;
            copyBoxes[idx].x = newx;
            copyBoxes[idx].width = neww;
            this.setState({
              boxes: copyBoxes
            });
            this.drawRects();
            this.updateCanvas();
            this.forceUpdate();
            return;
          }
          if (newx <= 1/this.state.imagewidth) {
            distx = x - 1 / this.state.imagewidth;
            newx = 1 / this.state.imagewidth;
            neww += distx;
            copyBoxes[idx].x = newx;
            copyBoxes[idx].width = neww;
            this.setState({
              boxes: copyBoxes
            });
            this.drawRects();
            this.updateCanvas();
            this.forceUpdate();
            return;
          }
          if (newy <= 1/this.state.imageheight) {
            disty = y - 1 / this.state.imageheight;
            newy = 1 / this.state.imageheight;
            copyBoxes[idx].y = newy;
            copyBoxes[idx].height = newh;
            this.setState({
              boxes: copyBoxes
            });
            this.drawRects();
            this.updateCanvas();
            this.forceUpdate();
            return;
          }
          if (
            newy > 1/this.state.imageheight &&
            newy <= (y + h) - 2/this.state.imageheight &&
            Math.abs(newy - y) > 1/this.state.imageheight
          ) {
            console.log("within y range");
            disty = y - newy;
            newh += disty;
            copyBoxes[idx].y = newy;
            copyBoxes[idx].height = newh;
            this.setState({
              boxes: copyBoxes
            });
            this.drawRects();
            this.updateCanvas();
            this.forceUpdate();
            return;
          }
          if (newx > (x + w) - 2/this.state.imagewidth) {
            distx = x - (x + w) - 2 / this.state.imagewidth;
            newx = x + w - 2 / this.state.imagewidth;
            neww = 2 / this.state.imagewidth;
            copyBoxes[idx].x = newx;
            copyBoxes[idx].width = neww;
            this.setState({
              boxes: copyBoxes
            });
            this.drawRects();
            this.updateCanvas();
            this.forceUpdate();
            return;
          }
          if (newy > (y + h) - 2/this.state.imageheight) {
            disty = y - (y + h - 2 / this.state.imageheight);
            newy = y + h - 2 / this.state.imageheight;
            newh = 2 / this.state.imageheight;
            copyBoxes[idx].y = newy;
            copyBoxes[idx].height = newh;
            this.setState({
              boxes: copyBoxes
            });
            this.drawRects();
            this.updateCanvas();
            this.forceUpdate();
            return;
          }
          return;
        } else if (br) {
          let distx = 0;
          let disty = 0;
          let neww = w;
          let newh = h;
          if (newx < 1 && newx >= x + 2.0/this.state.imagewidth) {
            // the top left can move to 1 or 2 pixels left of the right side (otherwise it's not a box)
            distx = Math.abs(x - newx);
          }
          if (newx >= 1) {
            distx = Math.abs(x - 1);
          }
          if (newy >= 1) {
            disty = Math.abs(y - 1);
          }
          if (newy < 1 && newy >= y + 2/this.state.imageheight) {
            disty = Math.abs(y - newy);
          }
          if (newx < x + 2/this.state.imagewidth) {
            distx = 2/this.state.imagewidth;
          }
          if (newy < y + 2/this.state.imageheight) {
            disty = 2/this.state.imageheight;
          }
          neww = distx;
          newh = disty;
          copyBoxes[idx].width = neww;
          copyBoxes[idx].height = newh;
          this.setState({
            boxes: copyBoxes
          });
          this.drawRects();
          this.updateCanvas();
          this.forceUpdate();
      }
      }
    }
  }

  updateImage() {
    const imageBackground = (
      <Img
        src={this.props.image}
        height={
          this.state.windowheight == 0
            ? window.innerHeight
            : this.state.windowheight
        }
        width={
          (this.state.windowwidth == 0
            ? window.innerWidth
            : this.state.windowwidth) * 0.7
        }
        onLoad={this.getImageSize}
        space="fit"
      />
    );
    this.state.image = imageBackground;
  }

  updateCanvas(num = 0) {
    //this.drawRects();
    const newStage = (
      <Stage
        width={
          this.state.imagewidth == 0 ? window.innerWidth : this.state.imagewidth
        }
        height={
          this.state.imageheight == 0
            ? window.innerHeight
            : this.state.imageheight
        }
        style={{
          backgroundColor: "#ff0000"
        }}
        onDblClick={this.handleDoubleClick.bind(this)}
        onMouseMove={this.handleMouseMove}
        onContentMouseUp={this.handleMouseUp}
      >
        <Layer>
          {this.state.image}
          {this.state.labelBoxes}
        </Layer>
      </Stage>
    );
    if (num === 0) {
      this.setState({stage: newStage, initial: this.state.initial + 1 });
    }
  }

  getTitleForModal() {
    return "This rectangle will contain a:";
  }
  handleSelectChange(event) {
    this.setState({ selectType: event.target.value });
  }

  done(evt) {
    let idx = findBox(this.state.iddoubleclicked, this.state.boxes);
    let newBoxes = this.state.boxes;

    let type = null;
    let switchType = this.state.selectType;
    if (this.state.selectType === null) {
      switchType = "red_curb";
    }
    console.log("switchType:", switchType);
    switch (switchType) {
      case "permament_permit_sign":
        type = labels.permament_permit_sign;
        break;
      case "permanent_no_parking_sign":
        type = labels.permanent_no_parking_sign;
        break;
      case "permanent_no_stopping_sign":
        type = labels.permanent_no_stopping_sign;
        break;
      case "permanent_time_limit_sign":
        type = labels.permanent_time_limit_sign;
        break;
      case "permanent_bus_stop_sign":
        type = labels.permanent_bus_stop_sign;
        break;
      case "permanent_no_drop_off_pick_up_sign":
        type = labels.permanent_no_drop_off_pick_up_sign;
        break;
      case "permanent_meter_sign":
        type = labels.permanent_meter_sign;
        break;
      case "permanent_street_sign":
        type = labels.permanent_street_sign;
        break;
      case "permanent_private_parking_sign":
        type = labels.permanent_private_parking_sign;
        break;
      case "permanent_other_sign":
        type = labels.permanent_other_sign;
        break;
      case "temporary_no_parking_sign":
        type = labels.temporary_no_parking_sign;
        break;
      case "temporary_no_stopping_sign":
        type = labels.temporary_no_stopping_sign;
        break;
      case "temporary_time_limit_sign":
        type = labels.temporary_time_limit_sign;
        break;
      case "temporary_permit_sign":
        type = labels.temporary_permit_sign;
        break;
      case "temporary_other_sign":
        type = labels.temporary_other_sign;
        break;
      case "hydrant":
        type = labels.hydrant;
        break;
      case "meter":
        type = labels.meter;
        break;
      case "red_curb":
        type = labels.red_curb;
        break;
      case "yellow_curb":
        type = labels.yellow_curb;
        break;
      case "white_curb":
        type = labels.white_curb;
        break;
      case "green_curb":
        type = labels.green_curb;
        break;
      case "blue_curb":
        type = labels.blue_curb;
        break;
      case "not_interesting":
        type = labels.not_interesting;
        break;
      default:
        type = labels.not_interesting;
        break;
    }
    newBoxes[idx].type = type;
    this.setState({ boxes: newBoxes, showModal: false, iddoubleclicked: null });
    console.log("here in done MYTYPE: " + type);
    this.drawRects();
    this.updateCanvas();
    this.forceUpdate();
  }

  cancel(evt) {
    console.log(evt);
    console.log(evt.target.value);
    this.setState({ showModal: false, iddoubleclicked: null });
    this.drawRects();
    this.updateCanvas();
  }
  getContentForModal() {
    return (
      <div>
        <div>
          <Select onChange={this.handleSelectChange.bind(this)}>
            <option value="red_curb">Red Curb</option>
            <option value="green_curb">Green Curb</option>
            <option value="yellow_curb">Yellow Curb</option>
            <option value="white_curb">White Curb</option>
            <option value="blue_curb">Blue Curb</option>
            <option value="hydrant">Fire Hydrant</option>
            <option value="meter">Parking Meter</option>
            <option value="permanent_no_parking_sign">
              Permanent No Parking Sign
            </option>
            <option value="permanent_no_stopping_sign">
              Permanent No Stopping Sign
            </option>
            <option value="permanent_time_limit_sign">
              Permanent Time Limit Sign
            </option>
            <option value="permament_permit_sign">
              Permanent Permit Exempt Sign
            </option>
            <option value="permanent_bus_stop_sign">
              Permanent Bus Stop Sign
            </option>
            <option value="permanent_no_drop_off_pick_up_sign">
              Permanent No Drop-off/Pick-up Sign
            </option>
            <option value="permanent_meter_sign">
              Permanent Meter Sign (Sign for cost of meter)
            </option>
            <option value="permanent_street_sign">
              A street sign (e.g. "Rodeo Dr.")
            </option>
            <option value="permanent_private_parking_sign">
              Private Parking Sign
            </option>
            <option value="permanent_other_sign">
              Permanent Parking Restriction Sign Not Listed
            </option>
            <option value="temporary_no_parking_sign">
              Temporary No Parking Sign
            </option>
            <option value="temporary_no_stopping_sign">
              Temporary No Stopping Sign
            </option>
            <option value="temporary_time_limit_sign">
              Temporary Time Limit Sign
            </option>
            <option value="temporary_permit_sign">
              Temporary Permit Exempt/Required Sign
            </option>
            <option value="temporary_other_sign">
              Temporary Other Parking Sign Not Listed
            </option>
            <option value="not_interesting">Sign Not About Parking!</option>
          </Select>
        </div>
        <ButtonOk value="done" onClick={this.done.bind(this)}>
          {" "}
          Done!{" "}
        </ButtonOk>
        <ButtonCancel value="cancel" onClick={this.cancel.bind(this)}>
          {" "}
          Cancel{" "}
        </ButtonCancel>
      </div>
    );
  }

  render() {
    console.log(this.state.originalimagewidth);
    return (
      <div>
        <Modal
          isOpen={this.state.showModal}
          style={styles.modalStyle}
          contentLabel="Modal"
        >
          <h2>{this.getTitleForModal()}</h2>
          <p>{this.getContentForModal()}</p>
        </Modal>
        <br />
        <br />
        <DivImg ref="imageplane" style={{
          minWidth: this.state.originalimagewidth,
        }}>
          <div
            style={{
              backgroundColor: "green",
              margin: 0
            }}
            ref="stageholder"
          >
            {this.state.stage}
          </div>
        </DivImg>
        <div>
          <DivLabels>Labels</DivLabels>
          <DivRestrs>Restriction</DivRestrs>
        </div>
      </div>
    );
  }
}
export default LabelingContent;
