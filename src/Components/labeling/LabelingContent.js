import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { Stage, Layer } from "react-konva";
import Modal from "react-modal";
import LabelBox from "./LabelBox";
import labels from "../labeling/Labels";
import SortableComponent from "./SortableComponent";
import { changeLabels } from "../../Actions/label.action.creators";
import Img from "./Img";

function findBox(id, boxes) {
  for (let i = 0; i < boxes.length; i += 1) {
    if (boxes[i].id === id) {
      return i;
    }
  }
  return -1;
}

const DivImg = styled.div`
  float: left;
  align-content: center;
  align: center;
  textalign: center;
  padding: 0px;
  margin: 0px;
`;

const DivLabels = styled.div`
  border: 2px solid black;
  border-radius: 10px;
  padding-left: 5px;
  width: 35vw;
  height: 59vh;
  float: left;
  overflow-y: auto;
`;
const DivRestrs = styled.div`
  width: 35vw;
  height: 40vh;
  float: left;
  padding-left: 5px;
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
      width: "60%",
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
      imageinitial: 0,
      stage: null,
      layer: null,
      div: null,
      drawingBox: false,
      boxes: [],
      labels: [],
      labelButtons: [],
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
    this.reorderedState = this.reorderedState.bind(this);
    this.keyPressed = this.keyPressed.bind(this);
  }

  // Probably slows performance and may not be correct considering we are not using the real DOM
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
    window.addEventListener("keypress", this.keyPressed);
    window.addEventListener("keydown", this.keyDown);
  }
  keyPressed(evt) {
    console.log(evt.key);
    switch (evt.key) {
      case "a":
        this.props.previous();
        return;
      case "d":
        this.props.next();
        return;
      case "S":
        this.props.save(this.state);
        return;
      case "X":
        this.deleteBox();
        return;
      default:
        return;
    }
  }
  keyDown(evt) {
    console.log(evt);
    switch (evt.keyCode) {
      case 37:
        //left arrow
        break;
      case 39:
        //right arrow
        break;
      case 38:
        //up arrow
        break;
      case 40:
        //down arrow
        break;
      default:
        break;
    }
  }
  deleteBox() {
    let newBoxes = this.state.boxes;
    let newLabels = this.props.labels;
    for (let i = 0; i < newLabels.length; i++) {
      const label = newLabels[i];
      console.log(label);
      if (label.selected === true) {
        let idx = findBox(label.id, newBoxes);
        console.log("IDX", idx);
        newBoxes.splice(idx, 1);
        newLabels.splice(i, 1);
        break;
      }
    }
    this.setState({ boxes: newBoxes });
    this.props.dispatch(changeLabels(newLabels));
    this.updateImage();
    this.updateCanvas();
    this.drawRects();
    this.generateLabelButtons();
  }
  componentWillUpdate() {
    this.updateCanvas(this.state.initial);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }
  updateWindowDimensions() {
    this.generateLabelButtons();
    this.setState({
      windowwidth: window.innerWidth,
      windowheight: window.innerHeight
    });
    this.updateImage();
    this.updateCanvas();
    this.drawRects();
    this.forceUpdate();
  }
  handleDoubleClickFromRect(event, id) {
    this.setState({
      iddoubleclicked: id,
      showModal: true
    });
  }

  getImageSize(evt) {
    console.log("imagesize:", evt);
    this.setState({
      imagewidth: evt.width,
      imageheight: evt.height,
      originalimagewidth: evt.width
    });
    this.updateCanvas(0);
  }

  handleDoubleClick(event) {
    if (this.state.iddoubleclicked === null) {
      const { x, y } = this.state.stageRef.getPointerPosition();
      let newBoxes = this.state.boxes;
      newBoxes.push({
        x: x / this.state.imagewidth, // use proportions
        y: y / this.state.imageheight,
        width: 90 / this.state.imagewidth,
        height: 90 / this.state.imageheight,
        type: labels.red_curb,
        id: newBoxes.length === 0 ? 0 : newBoxes[newBoxes.length - 1].id + 1,
        justCreated: true
      });
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
    const { x, y } = event.currentTarget.getPointerPosition();
    this.setState({
      stageRef: event.currentTarget,
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
    let values = [];
    this.state.boxes.forEach(box => {
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
    this.setState({ labelBoxes: values });
    this.forceUpdate();
  }

  handleMouseUp(evt) {
    this.stoppedMovingRect(this.state.movingRect);
  }

  movingRect(id) {
    this.setState({ movingRect: id, selectedRect: id });
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
    if (boxObj !== null && boxObj !== undefined && idx >= 0) {
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
          (x > newx - 15 / this.state.imagewidth &&
            x < newx + 15 / this.state.imagewidth &&
            y > newy - 15 / this.state.imageheight &&
            y < newy + 15 / this.state.imageheight) ||
          this.state.mouseInTopLeftCorner
        ) {
          // touching topLeft corner
          tl = true;
          this.setState({ mouseInTopLeftCorner: true });
        }
        if (
          (x + w > newx - 15 / this.state.imagewidth &&
            x + w < newx + 15 / this.state.imagewidth &&
            y + h > newy - 15 / this.state.imageheight &&
            y + h < newy + 15 / this.state.imageheight) ||
          this.state.mouseInBottomRightCorner
        ) {
          br = true;
          this.setState({ mouseInBottomRightCorner: true });
        }
        if (!br && !tl) {
          const distX = newx - lastx;
          const distY = newy - lasty;
          if (copyBoxes[idx].x + distX > 0.5 / this.state.imagewidth) {
            if (newx < 1 - copyBoxes[idx].width - 0.5 / this.state.imagewidth) {
              copyBoxes[idx].x += distX;
            } else if (
              newx >=
              1 - copyBoxes[idx].width - 0.5 / this.state.imagewidth
            ) {
              copyBoxes[idx].x =
                1 - copyBoxes[idx].width - 0.5 / this.state.imagewidth;
            }
          } else {
            copyBoxes[idx].x = 1 / this.state.imagewidth;
          }
          if (copyBoxes[idx].y + distY > 0.5 / this.state.imageheight) {
            if (
              newy <
              1 - copyBoxes[idx].height - 0.5 / this.state.imageheight
            ) {
              copyBoxes[idx].y += distY;
            } else if (
              newy >=
              1 - copyBoxes[idx].height - 0.5 / this.state.imageheight
            ) {
              copyBoxes[idx].y =
                1 - copyBoxes[idx].height - 0.5 / this.state.imageheight;
            }
          } else {
            copyBoxes[idx].y = 0.5 / this.state.imageheight;
          }
          this.setState({
            boxes: copyBoxes
          });
          this.drawRects();
          this.updateCanvas();
          this.forceUpdate();
        } else if (tl) {
          // move x y to mouse position and change w/h
          let distx = 0;
          let disty = 0;
          let neww = w;
          let newh = h;
          if (
            newx > 0.5 / this.state.imagewidth &&
            newx <= x + w - 1.0 / this.state.imagewidth &&
            Math.abs(newx - x) > 0.5 / this.state.imagewidth
          ) {
            console.log("here ", newx, x);
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
          if (newx <= 1 / this.state.imagewidth) {
            distx = x - 0.5 / this.state.imagewidth;
            newx = 0.5 / this.state.imagewidth;
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
          if (newy <= 0.5 / this.state.imageheight) {
            disty = y - 0.5 / this.state.imageheight;
            newy = 0.5 / this.state.imageheight;
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
            newy > 0.5 / this.state.imageheight &&
            newy <= y + h - 1 / this.state.imageheight &&
            Math.abs(newy - y) > 0.5 / this.state.imageheight
          ) {
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
          if (newx > x + w - 1.0 / this.state.imagewidth) {
            distx = x - (x + w) - 1.0 / this.state.imagewidth;
            newx = x + w - 1.0 / this.state.imagewidth;
            neww = 1.0 / this.state.imagewidth;
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
          if (newy > y + h - 1.0 / this.state.imageheight) {
            disty = y - (y + h - 1.0 / this.state.imageheight);
            newy = y + h - 1.0 / this.state.imageheight;
            newh = 1.0 / this.state.imageheight;
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
          let distx = w;
          let disty = h;
          let neww = w;
          let newh = h;
          console.log({ newx, neww, newh });
          if (newx < 1 && newx >= x + 1.0 / this.state.imagewidth) {
            // the top left can move to 1 or 2 pixels left of the right side (otherwise it's not a box)
            distx = Math.abs(x - newx);
            console.log("x1", distx);
          }
          if (newx >= 1) {
            distx = Math.abs(x - 1);
          }
          if (newy >= 1) {
            disty = Math.abs(y - 1);
          }
          if (newy < 1 && newy >= y + 1.0 / this.state.imageheight) {
            disty = Math.abs(y - newy);
          }
          if (newx < x + 1.0 / this.state.imagewidth) {
            distx = 1.0 / this.state.imagewidth;
          }
          if (newy < y + 1.0 / this.state.imageheight) {
            disty = 1.0 / this.state.imageheight;
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
  stage = null;
  image = null;
  updateCanvas(num = 0) {
    //this.drawRects();
    console.log(this.props);
    const newStage = (
      <Stage
        width={
          this.state.imagewidth !== 0
            ? this.state.imagewidth
            : window.innerWidth * 0.4
        }
        height={window.innerHeight}
        style={{
          textAlign: "center"
        }}
        onDblClick={this.handleDoubleClick.bind(this)}
        onMouseMove={this.handleMouseMove}
        onContentMouseUp={this.handleMouseUp}
        id="stageid"
      >
        <Layer>
          {this.image}
          {this.state.labelBoxes}
        </Layer>
      </Stage>
    );
    console.log(newStage);
    console.log(this.props);
    this.stage = newStage;
    if (num === 0) {
      console.log("setting state");
      //console.log(newStage);
      //console.log(newStage.getStage());
      // this.forceUpdate();
    }
  }
  updateImage(initial = 1) {
    let newImage = (
      <Img
        src={this.props.image}
        height={window.innerHeight}
        width={window.innerWidth * 0.6}
        onLoad={this.getImageSize}
        space="fit"
      />
    );
    this.image = newImage;
  }
  generateLabelButtons() {
    const sortableComponent = (
      <SortableComponent
        id="sortable"
        items={this.props.labels}
        reorderedState={this.reorderedState}
      />
    );
    this.setState({ labelButtons: sortableComponent });
  }

  reorderedState(items) {
    console.log("reordered state: ", items);
    //this.setState({ labels: items });
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
    let selectType = this.state.selectType;
    if (this.state.selectType === null) {
      selectType = "red_curb";
    }
    type = labels[selectType];
    newBoxes[idx].type = type;
    newBoxes[idx].justCreated = false;
    let newLabels = this.props.labels.filter(label => {
      if (label !== undefined && label.id !== newBoxes[idx].id) {
        return true;
      }
      return false;
    });
    newLabels.push({
      type: selectType,
      id: this.state.iddoubleclicked
    });
    this.props.dispatch(changeLabels(newLabels));
    this.setState({
      boxes: newBoxes,
      showModal: false,
      iddoubleclicked: null,
      selectType: null
    });
    this.drawRects();
    this.generateLabelButtons();
    this.updateCanvas();
  }

  cancel(evt) {
    // If the box we just added was cancelled before giving it a
    if (this.state.boxes[this.state.boxes.length - 1].justCreated) {
      let newBoxes = this.state.boxes;
      newBoxes.pop();
      this.setState({ boxes: newBoxes });
    }
    this.setState({ showModal: false, iddoubleclicked: null });
    this.drawRects();
    this.updateCanvas();
  }
  getContentForModal() {
    return (
      <div>
        <div>
          <Select onChange={this.handleSelectChange.bind(this)}>
            {Object.keys(labels).map(key => {
              return (
                <option value={key} key={key}>
                  {labels[key].value}
                </option>
              );
            })}
          </Select>
        </div>
        <ButtonOk value="done" onClick={this.done.bind(this)}>
          {" Done! "}
        </ButtonOk>
        <ButtonCancel value="cancel" onClick={this.cancel.bind(this)}>
          {" Cancel "}
        </ButtonCancel>
      </div>
    );
  }

  render() {
    if (this.stage) {
      console.log("THIS STAGE:", this.stage);
    }
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
        <DivImg
          ref="imageplane"
          style={{
            width: window.innerWidth * 0.6,
            height: window.innerHeight
          }}
        >
          <div
            style={{
              width: window.innerWidth * 0.6,
              height: window.innerHeight,
              textAlign: "center",
              paddingLeft: "20%",
              margin: 0
            }}
            ref="stageholder"
          >
            {this.stage}
          </div>
        </DivImg>
        <div>
          <DivLabels>
            <h4>{"Labels (scrolling):"}</h4>
            {this.state.labelButtons}
          </DivLabels>
          <DivRestrs>
            <h4>{"Keys:"}</h4>
            a = previous<br />
            d = next<br />
            S = Save (note that it's capital)<br />
            X = Remove a box (you first have to select one on the Labels list)
          </DivRestrs>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  console.log("LABELING", state);
  let newProps = {};
  newProps.labels = state.updateLabels.labels;
  console.log("NEW PROPS", newProps);
  return newProps;
};
const mapDispatchToProps = dispatch => {
  return {
    dispatch
  };
};

LabelingContent = connect(mapStateToProps, mapDispatchToProps)(LabelingContent);
export default withRouter(LabelingContent);
