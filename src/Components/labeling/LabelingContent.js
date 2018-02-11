import React, { Component } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import styled from "styled-components";
import NativeListener from "react-native-listener";
import { Stage, Layer, Rect, Group, Line } from "react-konva";
import Konva from "konva";
import LabelBox from "./LabelBox";
import AtomicImage from "./AtomicImage";
import labels from "../labeling/Labels";

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
  height: 60vh;
  float: left;
`;
const DivRestrs = styled.div`
  border: 1px solid black;
  width: 25vw;
  height: 40vh;
  float: left;
`;

class LabelingContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      stage: null,
      layer: null,
      div: null,
      drawingBox: false,
      boxes: [
        {
          x: 5,
          y: 5,
          width: 100,
          height: 100,
          type: labels.permament_permit_sign,
          id: 0
        }
      ],
      rects: [],
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
      }
    };
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }
  // Probably slows performance and may not be correct considering we are not using the real DOM
  componentDidMount() {
    this.setState({
      stage: this.refs.stage,
      layer: this.refs.layer,
      image: this.refs.bgimage,
      div: this.refs.stageholder.getBoundingClientRect(),
      imageheight: this.refs.bgimage.imageNode.attrs.height,
      imagewidth: this.refs.bgimage.imageNode.attrs.width
    });
    this.drawRects();
    this.updateCanvas();
  }
  componentWillUpdate() {
    this.updateCanvas();
    this.drawRects();
  }

  handleMouseDown(event) {
    console.log(event);
    if (this.state && this.state.div != null) {
      console.log(this.state);
      const { x, y } = this.state.stage.getStage().getPointerPosition();
      let boxes = this.state.boxes;
      boxes.push({x: x, y: y, width: 20, height: 20, type:labels.permanent_no_parking_sign, id: boxes[boxes.length-1].id + 1});
      console.log(boxes);
      this.setState({
        lastMouseLocation: this.state.mouseLocation,
        mouseLocation: {
          x,
          y
        },
        boxes
      });
      this.forceUpdate();
    }
  }

  getMouseLocation() {
    return this.state.mouseLocation;
  }

  handleMouseMove(event) {
    // update location
    if (this.state.div != null) {
      const { x, y } = this.state.stage.getStage().getPointerPosition();
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
  }

  changeDrawingBoxState(drawingState) {
    this.setState({
      drawingBox: drawingState
    });
  }

  drawRects() {
    const values = this.state.boxes.map(box => (
      <LabelBox
        x={box.x}
        y={box.y}
        width={box.width}
        height={box.height}
        type={box.type}
        fill="blue"
        movingRect={this.movingRect.bind(this)}
        stoppedMovingRect={this.stoppedMovingRect.bind(this)}
        style={{
          zIndex: 100
        }}
        id={box.id}
      />
    ));
    return values;
  }

  handleMouseUp(evt) {
    for (const box of this.state.boxes) {
      const id = box.id;
      const boxObj = this.state.stage.getStage().find(`#${id}`)[0].children[0];
      console.log(boxObj);
      boxObj.eventListeners.mouseup[0].handler(evt);
      this.stoppedMovingRect(this.state.movingRect);
    }
  }

  movingRect(id) {
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
    const groupObj = this.state.stage.getStage().find(`#${id}`);
    const boxObj = groupObj[0].children[0];
    if (boxObj != null && boxObj != undefined && idx >= 0) {
      const x = boxObj.getX() * 1.0;
      const y = boxObj.getY() * 1.0;
      const w = boxObj.getWidth() * 1.0;
      const h = boxObj.getHeight() * 1.0;
      let tl = false;
      let br = false;
      // Also get the position of
      if (!isNaN(x) && !isNaN(y) && !isNaN(w)) {
        if (
          (x > this.state.mouseLocation.x - 20 &&
            x < this.state.mouseLocation.x + 20 &&
            y > this.state.mouseLocation.y - 20 &&
            y < this.state.mouseLocation.y + 20) ||
          this.state.mouseInTopLeftCorner
        ) {
          // touching topLeft corner
          tl = true;
          this.setState({ mouseInTopLeftCorner: true });
        }
        if (
          (x + w > this.state.mouseLocation.x - 15 &&
            x + w < this.state.mouseLocation.x + 15 &&
            y + h > this.state.mouseLocation.y - 15 &&
            y + h < this.state.mouseLocation.y + 15) ||
          this.state.mouseInBottomRightCorner
        ) {
          console.log("touching br");
          br = true;
          this.setState({ mouseInBottomRightCorner: true });
        }
        if (!br && !tl) {
          const distX =
            this.state.mouseLocation.x - this.state.lastMouseLocation.x;
          const distY =
            this.state.mouseLocation.y - this.state.lastMouseLocation.y;
          console.log("not touching corners");
          if (this.state.mouseLocation.x > 1) {
            if (
              this.state.mouseLocation.x <
              this.state.imagewidth - copyBoxes[idx].width - 1
            ) {
              copyBoxes[idx].x += distX;
            } else if (
              this.state.mouseLocation.x >=
              this.state.imagewidth - copyBoxes[idx].width - 1
            ) {
              copyBoxes[idx].x =
                this.state.imagewidth - copyBoxes[idx].width - 1;
            }
          } else {
            copyBoxes[idx].x = 1;
          }
          if (this.state.mouseLocation.y > 1) {
            if (
              this.state.mouseLocation.y <
              this.state.imageheight - copyBoxes[idx].height - 1
            ) {
              copyBoxes[idx].y += distY;
            } else if (
              this.state.mouseLocation.y >=
              this.state.imageheight - copyBoxes[idx].height - 1
            ) {
              copyBoxes[idx].y =
                this.state.imageheight - copyBoxes[idx].height - 1;
            }
          } else {
            copyBoxes[idx].y = 1;
          }
          this.setState({
            boxes: copyBoxes
          });
          this.forceUpdate();
        } else if (tl) {
          console.log("in top left drag");
          // move x y to mouse position and change w/h
          let newx = this.state.mouseLocation.x;
          let newy = this.state.lastMouseLocation.y;
          let distx = 0;
          let disty = 0;
          let neww = w;
          let newh = h;
          if (newx > 1 && newx <= x + w - 2.0 && Math.abs(newx - x) > 3) {
            // the top left can move to 1 or 2 pixels left of the right side (otherwise it's not a box)
            distx = x - newx;
            neww += distx;
            copyBoxes[idx].x = newx;
            copyBoxes[idx].width = neww;
            this.setState({
              boxes: copyBoxes
            });
            this.forceUpdate();
            return;
          } 
          if (newx <= 1) {
            distx = x - 1;
            newx = 1;
            neww += distx;
            copyBoxes[idx].x = newx;
            copyBoxes[idx].width = neww;
            this.setState({
              boxes: copyBoxes
            });
            this.forceUpdate();
            return;
          }
          if (newy <= 1) {
            disty = y - 1;
            newy = 1;
            copyBoxes[idx].y = newy;
            copyBoxes[idx].height = newh;  
            this.setState({
              boxes: copyBoxes
            });
            this.forceUpdate();
            return;
          } 
          if (newy > 1 && newy <= y + h - 2 && Math.abs(newy - y) > 1) {
            console.log("within y range");
            disty = y - newy;
            newh += disty;
            copyBoxes[idx].y = newy;          
            copyBoxes[idx].height = newh;
            this.setState({
              boxes: copyBoxes
            });
            this.forceUpdate();
            return;
          } 
          if (newx > x + w - 2) {
            distx = x - (x + w - 2);
            newx = x + w - 2;
            neww = 2;
            copyBoxes[idx].x = newx;
            copyBoxes[idx].width = neww;
            this.setState({
              boxes: copyBoxes
            });
            this.forceUpdate();
            return;
          }
          if (newy > y + h - 2) {
            disty = y - (y + h - 2);
            newy = y + h - 2;
            newh = 2;
            copyBoxes[idx].y = newy;          
            copyBoxes[idx].height = newh;
            this.setState({
              boxes: copyBoxes
            });
            this.forceUpdate();
            return;
          }
          return;
        } else if (br) {
          let newbrx = this.state.mouseLocation.x;
          let newbry = this.state.mouseLocation.y;
          let distx = 0;
          let disty = 0;
          let neww = w;
          let newh = h;
          if (newbrx < this.state.imagewidth && newbrx >= x + 2.0) {
            // the top left can move to 1 or 2 pixels left of the right side (otherwise it's not a box)
            distx = Math.abs(x - newbrx);
          }
          if (newbrx >= this.state.imagewidth) {
            distx = Math.abs(x-this.state.imagewidth);
          }
          if (newbry >= this.state.imageheight) {
            disty = Math.abs(y-this.state.imageheight);
          }
          if (newbry < this.state.imageheight && newbry >= y + 2) {
            disty = Math.abs(y - newbry);
          }
          if (newbrx < x + 2) {
            distx = 2;
          }
          if (newbry < y + 2) {
            disty = 2;
          }
          neww = distx;
          newh = disty;
          copyBoxes[idx].width = neww;
          copyBoxes[idx].height = newh;
          this.setState({
            boxes: copyBoxes
          });
          this.forceUpdate();
        }
      }
    }
  }

  updateCanvas() {
    if (this.state.image != null && this.state.div != null) {
      const { width, height } = this.state.image.imageNode.attrs.image;
      const divWidth = this.state.div.width;
      const divHeight = this.state.div.height;
      if (width > height) {
        // landscape
        const ratio = width / divWidth;
        this.state.imagewidth = divWidth;
        this.state.imageheight = height / ratio;
      } else {
        // portrait
        const ratio = height / window.innerHeight;
        this.state.imagewidth = width / ratio;
        this.state.imageheight = window.innerHeight;
      }
    }
  }

  render() {
    return (
      <div>
        <br />
        <br />
        <DivImg>
          <div
            style={{
              backgroundColor: "green",
              width: this.state.imagewidth,
              height: this.state.imageheight,
              margin: 0
            }}
            ref="stageholder"
          >
            <Stage
              width={this.state.imagewidth}
              height={this.state.imageheight}
              style={{
                backgroundColor: "#ff0000",
                width: this.state.imagewidth,
                height: this.state.imageheight
              }}
              onDblClick={this.handleMouseDown.bind(this)}
              //onContentDblClick={this.handleMouseDown.bind(this)}
              onContentMouseMove={this.handleMouseMove.bind(this)}
              onContentMouseUp={this.handleMouseUp}
              ref="stage"
            >
              <Layer ref="layer">
                <AtomicImage
                  src={this.props.image}
                  width={this.state.imagewidth}
                  height={this.state.imageheight}
                  ref="bgimage"
                  style={{
                    zIndex: 0
                  }}
                />
                {this.drawRects()}
              </Layer>
            </Stage>
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
