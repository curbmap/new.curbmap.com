//set state warning is here canvas does not render in time for the life cycle hook
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Stage, Layer } from "react-konva";
import Modal from "react-modal";
import LabelBox from "./LabelBox";
import labels from "../labeling/Labels";
import SortableComponent from "./SortableComponent";
import { changeLabels } from "../../Actions/label.action.creators";
import Img from "./Img";
import info from "./i.svg";
import xinfo from "./x.svg";
import chevrondn from "./chevrondn.svg";
import chevronup from "./chevronup.svg";
import empty from "./empty.svg";
import "./labeling.css";

function findBox(id, boxes) {
  for (let i = 0; i < boxes.length; i += 1) {
    if (boxes[i].id === id) {
      return i;
    }
  }
  return -1;
}

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
      minWidth: "500px",
      height: "60%",
      minHeight: "300px",
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
      initial: 0,
      imageInitial: 0,
      stage: null,
      layer: null,
      drawingBox: false,
      boxes: [],
      labels: [],
      labelButtons: [],
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
      windowheight: 0,
      directions: null,
      scrollup: false,
      scrolldown: false
    };
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.getImageSize = this.getImageSize.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.reorderedState = this.reorderedState.bind(this);
    this.keyPressed = this.keyPressed.bind(this);
    this.save = this.save.bind(this);
    this.next = this.next.bind(this);
    this.deleteBox = this.deleteBox.bind(this);
    this.infoClicked = this.infoClicked.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  labelsScroll = null;

  // Probably slows performance and may not be correct considering we are not using the real DOM
  componentDidMount() {
    window.addEventListener("resize", this.updateWindowDimensions);
    window.addEventListener("keypress", this.keyPressed);
    window.addEventListener("keydown", this.keyDown);
    this.updateImage();
    this.updateCanvas();
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
    this.drawRects();
    this.updateCanvas();
  }

  keyPressed(evt) {
    switch (evt.key) {
      case "n":
        this.next(evt);
        return;
      case "S":
        this.save(evt);
        return;
      case "X":
        this.deleteBox();
        return;
      default:
        return;
    }
  }
  keyDown(evt) {
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
      if (label.selected === true) {
        let idx = findBox(label.id, newBoxes);
        newBoxes.splice(idx, 1);
        newLabels.splice(i, 1);
        break;
      }
    }
    this.setState({ boxes: newBoxes });
    this.props.dispatch(changeLabels(newLabels));
    this.generateLabelButtons();
    this.drawRects();
    this.updateCanvas();
  }
  handleDoubleClickFromRect(event, id) {
    this.setState({
      iddoubleclicked: id,
      showModal: true
    });
  }
  handleScroll(evt) {
    let target = evt.nativeEvent.target;
    let scroll = {
      height: target.clientHeight,
      totalHeight: target.scrollHeight,
      topOffset: target.scrollTop
    };
    console.log(scroll);
    let below = false;
    let above = false;
    if (scroll.totalHeight - scroll.topOffset > scroll.height) {
      // more below
      below = true;
    }
    if (scroll.totalHeight - scroll.topOffset === 0) {
      // at bottom // no below
      below = false;
    }
    if (scroll.topOffset > 0) {
      // some above
      above = true;
    }
    this.setState({ scrollup: above, scrolldown: below });
  }

  getImageSize(evt) {
    this.setState({
      imagewidth: evt.width,
      imageheight: evt.height,
      originalimagewidth: evt.width
    });
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
      this.updateCanvas();
      this.drawRects();
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
    if (
      x <= 0 ||
      y <= 0 ||
      x >= this.imagewidth - 1 ||
      y >= this.imageheight - 1
    ) {
      this.handleMouseUp(event);
    } else {
      if (this.state.movingRect != null) {
        // we have an object to move
        this.handleRectMove(this.state.movingRect);
      }
    }
    this.updateCanvas();
    this.drawRects();
  }

  changeDrawingBoxState(drawingState) {
    this.setState({
      drawingBox: drawingState
    });
  }

  drawRects() {
    let values = [];
    let lastValue = null;
    let reveresed = this.props.labels.slice().reverse();
    reveresed.forEach((label, i, arr) => {
      let idx = findBox(label.id, this.state.boxes);
      let box = this.state.boxes[idx];
      if (box !== undefined) {
        if (label.selected) {
          lastValue = (
            <LabelBox
              selected={true}
              x={box.x * this.state.imagewidth}
              y={box.y * this.state.imageheight}
              type={box.type}
              width={box.width * this.state.imagewidth}
              height={box.height * this.state.imageheight}
              movingRect={this.movingRect.bind(this)}
              stoppedMovingRect={this.stoppedMovingRect.bind(this)}
              doubleClick={this.handleDoubleClickFromRect.bind(this)}
              zIndex={200}
              id={box.id}
              key={`box${box.id}`}
            />
          );
        } else {
          values.push(
            <LabelBox
              selected={false}
              x={box.x * this.state.imagewidth}
              y={box.y * this.state.imageheight}
              type={box.type}
              width={box.width * this.state.imagewidth}
              height={box.height * this.state.imageheight}
              movingRect={this.movingRect.bind(this)}
              stoppedMovingRect={this.stoppedMovingRect.bind(this)}
              doubleClick={this.handleDoubleClickFromRect.bind(this)}
              zIndex={90 + i}
              id={box.id}
              key={`box${box.id}`}
            />
          );
        }
      }
    });
    if (lastValue) {
      values.push(lastValue);
    }
    this.setState({ labelBoxes: values });
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
    if (!groupObj || groupObj.length < 1) {
      return;
    }
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
      if (
        !isNaN(x) &&
        !isNaN(y) &&
        !isNaN(w) &&
        Math.abs(newx - lastx) <= 1 &&
        Math.abs(newy - lasty) <= 1
      ) {
        if (
          (x > newx - 10 / this.state.imagewidth &&
            x < newx + 10 / this.state.imagewidth &&
            y > newy - 10 / this.state.imageheight &&
            y < newy + 10 / this.state.imageheight) ||
          this.state.mouseInTopLeftCorner
        ) {
          // touching topLeft corner
          tl = true;
          this.setState({ mouseInTopLeftCorner: true });
        }
        if (
          (x + w > newx - 10 / this.state.imagewidth &&
            x + w < newx + 10 / this.state.imagewidth &&
            y + h > newy - 10 / this.state.imageheight &&
            y + h < newy + 10 / this.state.imageheight) ||
          this.state.mouseInBottomRightCorner
        ) {
          br = true;
          this.setState({ mouseInBottomRightCorner: true });
        }
        if (!br && !tl) {
          const distX = newx - lastx;
          const distY = newy - lasty;
          if (copyBoxes[idx].x + distX > 0) {
            if (copyBoxes[idx].x + distX < 1 - copyBoxes[idx].width) {
              copyBoxes[idx].x += distX;
            } else {
              //
              copyBoxes[idx].x = 1 - copyBoxes[idx].width;
            }
          } else {
            copyBoxes[idx].x = 0;
          }
          if (copyBoxes[idx].y + distY > 0) {
            if (copyBoxes[idx].y + distY < 1 - copyBoxes[idx].height) {
              copyBoxes[idx].y += distY;
            } else {
              copyBoxes[idx].y = 1 - copyBoxes[idx].height;
            }
          } else {
            copyBoxes[idx].y = 0;
          }
          this.setState({
            boxes: copyBoxes
          });
          this.updateCanvas();
          this.drawRects();
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
            this.updateCanvas();
            this.drawRects();
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
            return;
          }
          return;
        } else if (br) {
          let distx = w;
          let disty = h;
          let neww = w;
          let newh = h;
          if (newx < 1 && newx >= x + 1.0 / this.state.imagewidth) {
            // the top left can move to 1 or 2 pixels left of the right side (otherwise it's not a box)
            distx = Math.abs(x - newx);
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
        }
      }
    }
  }
  updateCanvas(num = 0) {
    if (num === 0) {
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
        >
          <Layer>
            {this.state.image}
            {this.state.labelBoxes}
          </Layer>
        </Stage>
      );
      this.setState({ stage: newStage, initial: this.state.initial + 1 });
    }
  }

  save(evt) {
    this.props.save(
      { boxes: this.state.boxes, id: this.props.imageid },
      this.props.session,
      this.props.username
    );
  }
  next(evt) {
    this.props.next(this.props.imageid);
  }
  updateImage(num = 0) {
    let newImage = (
      <Img
        key={this.state.imageInitial}
        number={this.state.imageInitial}
        src={this.props.image}
        height={window.innerHeight}
        width={window.innerWidth * 0.4}
        onLoad={this.getImageSize}
        space="fit"
      />
    );
    // only set state directly first time through, otherwise use setState
    if (this.state.imageInitial === 0) {
      this.state.image = newImage;
      this.state.imageInitial = this.state.imageInitial + 1;
    } else {
      this.setState({
        image: newImage,
        imageInitial: this.state.imageInitial + 1
      });
    }
    this.drawRects();
    this.updateCanvas();
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
    this.updateCanvas();
    this.generateLabelButtons();
    if (this.labelsScroll) {
      console.log(this.labelsScroll);
      this.handleScroll({ nativeEvent: { target: this.labelsScroll } });
    }
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
          <select onChange={this.handleSelectChange.bind(this)}>
            {Object.keys(labels).map(key => {
              return (
                <option value={key} key={key}>
                  {labels[key].value}
                </option>
              );
            })}
          </select>
        </div>
        <button
          className="button-ok"
          value="done"
          onClick={this.done.bind(this)}
        >
          {" Done! "}
        </button>
        <button
          className="button-cancel"
          value="cancel"
          onClick={this.cancel.bind(this)}
        >
          {" Cancel "}
        </button>
      </div>
    );
  }
  infoClicked(evt) {
    if (this.state.directions) {
      this.setState({ directions: null });
    } else {
      this.setState({
        directions: (
          <ol>
            <li>
              {"Double click anywhere on the image to the left to create a box"}
            </li>
            <li>
              {"You will then be asked to label what will go in that box."}
            </li>
            <li>{"Then you can move and resize the box."}</li>
            <li>
              {
                "To resize the box, click on either the top left corner or the bottom right."
              }
            </li>
            <li>
              {
                "If you realize, later that you mislabeled a box, just select its label on the right (hold down on your mouse button over the label) and then double click the box on the image, you can relabel it."
              }
            </li>
            <li>
              {
                'If you label a box and think it was incorrect and unnecessary, just select its label on the right and click the "Delete box" button.'
              }
            </li>
            <li>
              {
                'When you are satisfied with your labels, you can click the "Submit and next" button below.'
              }
            </li>
            <li>
              {
                'If you decide you do not like the image you are working on, just click "Don\'t save, next".'
              }
            </li>
          </ol>
        )
      });
    }
  }
  render() {
    if (this.state.stage === null) {
      this.updateCanvas();
      return <div />;
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
        <div className="labeling-content">
          <div className="labeling-stage" ref="stageholder">
            {this.state.stage}
          </div>
          <div className="labeling-sidepanel">
            <div
              className={
                this.state.directions ? "directions-expanded" : "directions"
              }
            >
              <h4 className="directions-title">
                {"Directions"}
                <img
                  src={this.state.directions ? xinfo : info}
                  alt="information"
                  width={20}
                  height={20}
                  onClick={this.infoClicked}
                  className="info"
                />
              </h4>
              <br />
              {this.state.directions}
            </div>
            <div className="labels-holder">
              {"Labels:"}
              <div className="labels-signifier-top">
                {this.state.scrollup && (
                  <img
                    src={chevronup}
                    className="chevron"
                    alt="more above"
                    aria-hidden="true"
                  />
                )}
                {!this.state.scrollup && (
                  <img src={empty} className="chevron" />
                )}
              </div>

              <div
                className="labels"
                onScroll={this.handleScroll}
                ref={ref => {
                  this.labelsScroll = ref;
                }}
              >
                {this.state.labelButtons}
              </div>
              <div className="labels-signifier-bottom">
                {this.state.scrolldown && (
                  <img
                    src={chevrondn}
                    alt="more below"
                    className="chevron"
                    aria-hidden="true"
                  />
                )}
                {!this.state.scrolldown && (
                  <img src={empty} className="chevron" />
                )}
                <br /> &nbsp; <br />
              </div>
            </div>
            <div className="restrs">
              <div className="restrs-buttons">
                <button className="next" onClick={this.next}>
                  Don't save, next
                </button>
                <button className="save" onClick={this.save}>
                  Submit and next
                </button>
                <button className="del" onClick={this.deleteBox}>
                  Delete box
                </button>
              </div>
              <div>
                <h4>{"Shortcut Keys:"}</h4>
                n = next<br />
                S = Save (note that it's capital)<br />
                X = Remove a box (you first have to select one on the Labels
                list)
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  let newProps = {};
  newProps.labels = state.updateLabels.labels;
  newProps.session = state.auth.session;
  newProps.username = state.auth.username;
  return newProps;
};
const mapDispatchToProps = dispatch => {
  return {
    dispatch
  };
};

LabelingContent = connect(mapStateToProps, mapDispatchToProps)(LabelingContent);
export default withRouter(LabelingContent);
