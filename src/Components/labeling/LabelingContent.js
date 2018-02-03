import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import styled from 'styled-components'
import NativeListener from 'react-native-listener'
import { Stage, Layer, Rect, Group, Line } from 'react-konva'
import Konva from 'konva'
import LabelBox from './LabelBox'
import AtomicImage from './AtomicImage'
import labels from '../labeling/Labels'

function findBox(id, boxes) {
  for (let i = 0; i < boxes.length; i++) {
    if (boxes[i].id === id) {
      return i
    }
  }
  return -1
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
`

const DivLabels = styled.div`
  border: 1px solid black;
  width: 25vw;
  height: 60vh;
  float: left;
`
const DivRestrs = styled.div`
  border: 1px solid black;
  width: 25vw;
  height: 40vh;
  float: left;
`

class LabelingContent extends Component {
  constructor(props) {
    super(props)
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
          id: 'x',
        },
      ],
      rects: [],
      labels: [],
      restrs: [],
      selectedBoxIndex: null,
      mouseLocation: {
        x: null,
        y: null,
      },
      lastMouseLocation: {
        x: null,
        y: null,
      },
    }
    this.handleMouseUp = this.handleMouseUp.bind(this)
  }

  selectLabel(index) {
    this.setState({
      currentBoxLabel: this.state.labels[index],
    })
  }

  handleMouseDown(event) {
    console.log(event)
    if (this.state && this.state.div != null) {
      console.log(this.state)
      const { x, y } = this.state.stage.getStage().getPointerPosition()
      this.setState({
        lastMouseLocation: this.state.mouseLocation,
        mouseLocation: {
          x,
          y,
        },
      })
      // this.selectBox({ x, y })
      if (this.state.selectedBoxIndex == null) {
        // create the new box
        // this.beginDrawingBox(false)
      } else {
        // this.beginDrawingBox(true)
      }
    }
  }

  handleMouseMove(event) {
    if (this.state.drawingBox) {
      // this.mouseLocation = event
    }
    // update location
    if (this.state.div != null) {
      const { x, y } = this.state.stage.getStage().getPointerPosition()
      this.setState({
        lastMouseLocation: this.state.mouseLocation,
        mouseLocation: {
          x,
          y,
        },
      })
    }
    console.log(this.state.mouseLocation)
  }

  // Probably slows performance and may not be correct considering we are not using the real DOM
  componentDidMount() {
    this.setState({
      stage: this.refs.stage,
      layer: this.refs.layer,
      image: this.refs.bgimage,
      div: this.refs.stageholder.getBoundingClientRect(),
      imageheight: this.refs.bgimage.imageNode.attrs.height,
      imagewidth: this.refs.bgimage.imageNode.attrs.width,
    })
    this.drawRects()
    this.updateCanvas()
  }
  componentWillUpdate() {
    this.updateCanvas()
    this.drawRects()
  }

  changeDrawingBoxState(drawingState) {
    this.setState({
      drawingBox: drawingState,
    })
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
        onDrag={this.handleRectMove.bind(this)}
        style={{
          zIndex: 100,
        }}
        id={box.id}
      />
    ))
    return values
  }

  handleMouseUp(evt) {
    for (const box of this.state.boxes) {
      const id = box.id
      const boxObj = this.state.stage.getStage().find(`#${id}`)[0].children[0]
      console.log(boxObj)
      boxObj.eventListeners.mouseup[0].handler(evt)
    }
  }

  // Keep track in this parent what the state of the underlying boxes are!
  // So that we can return that data to the server later!
  handleRectMove(id, dist) {
    const copyBoxes = this.state.boxes.slice()
    const idx = findBox(id, copyBoxes)
    const groupObj = this.state.stage.getStage().find(`#${id}`)
    const boxObj = groupObj[0].children[0]
    if (boxObj != null && boxObj != undefined && idx >= 0) {
      const x = boxObj.getX() * 1.0
      const y = boxObj.getY() * 1.0
      const w = boxObj.getWidth() * 1.0
      const h = boxObj.getWidth() * 1.0
      console.log(dist, { x, y })
      let tl = false
      let br = false
      console.log(this.state.div)
      // dist.mouseUp.x -= this.state.div.left
      // dist.mouseUp.y -= this.state.div.top
      // Also get the position of
      if (!isNaN(x) && !isNaN(y) && !isNaN(w)) {
        if (
          x > dist.mouseDown.x - 10 &&
          x < dist.mouseDown.x + 10 &&
          y > dist.mouseDown.y - 10 &&
          y < dist.mouseDown.y + 10
        ) {
          // touching topLeft corner
          tl = true
        }
        if (
          x + w > dist.mouseDown.x - 10 &&
          x + w < dist.mouseDown.x + 10 &&
          y + h > dist.mouseDown.y - 10 &&
          y + h < dist.mouseDown.y + 10
        ) {
          console.log('touching br')
          br = true
        }
        if (!br && !tl) {
          console.log('not touching corners')
          if (dist.mouseUp.x > 1) {
            if (dist.mouseUp.x < this.state.imagewidth - copyBoxes[idx].width - 1) {
              copyBoxes[idx].x = dist.mouseUp.x
            } else if (dist.mouseUp.x >= this.state.imagewidth - copyBoxes[idx].width - 1) {
              copyBoxes[idx].x = this.state.imagewidth - copyBoxes[idx].width - 1
            }
          } else {
            copyBoxes[idx].x = 1
          }
          if (dist.mouseUp.y > 1) {
            if (dist.mouseUp.y < this.state.imageheight - copyBoxes[idx].height - 1) {
              copyBoxes[idx].y = dist.mouseUp.y
            } else if (dist.mouseUp.y >= this.state.imageheight - copyBoxes[idx].height - 1) {
              copyBoxes[idx].y = this.state.imageheight - copyBoxes[idx].height - 1
            }
          } else {
            copyBoxes[idx].y = 1
          }
          this.setState({
            boxes: copyBoxes,
          })
        } else if (tl) {
          console.log('in top left drag')
          // move x y to mouse position and change w/h
          let newx = dist.mouseUp.x
          let newy = dist.mouseUp.y
          let distx = 0
          let disty = 0
          let neww = w
          let newh = h
          if (newx > 1 && newx <= x + w - 2.0) {
            // the top left can move to 1 or 2 pixels left of the right side (otherwise it's not a box)
            distx = x - newx
            neww += distx
            console.log('within x range')
          }
          if (newx <= 1) {
            distx = x - 1
            newx = 1
          }
          if (newy <= 1) {
            disty = y - 1
            newy = 1
          }
          if (newy > 1 && newy <= y + h - 2) {
            console.log('within y range')
            disty = y - newy
            newh += disty
            console.log('within y range')
          }
          if (newx > x + w - 2) {
            distx = x - (x + w - 2)
            newx = x + w - 2
            neww = 2
          }
          if (newy > y + h - 2) {
            disty = y - (y + h - 2)
            newy = y + h - 2
            newh = 2
          }
          copyBoxes[idx].x = newx
          copyBoxes[idx].y = newy
          copyBoxes[idx].width = neww
          copyBoxes[idx].height = newh
          this.setState({
            boxes: copyBoxes,
          })
        } else if (br) {
        }
      }
    }
    this.forceUpdate()
  }

  updateCanvas() {
    if (this.state.image != null && this.state.div != null) {
      const { width, height } = this.state.image.imageNode.attrs.image
      const divWidth = this.state.div.width
      const divHeight = this.state.div.height
      if (width > height) {
        // landscape
        const ratio = width / divWidth
        this.state.imagewidth = divWidth
        this.state.imageheight = height / ratio
      } else {
        // portrait
        const ratio = height / window.innerHeight
        this.state.imagewidth = width / ratio
        this.state.imageheight = window.innerHeight
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
              backgroundColor: 'green',
              width: this.state.imagewidth,
              height: this.state.imageheight,
              margin: 0,
            }}
            ref="stageholder"
          >
            <Stage
              width={this.state.imagewidth}
              height={this.state.imageheight}
              style={{
                backgroundColor: '#ff0000',
                width: this.state.imagewidth,
                height: this.state.imageheight,
              }}
              onContentDblClick={this.handleMouseDown.bind(this)}
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
                    zIndex: 0,
                  }}
                />
                {this.drawRects()}
              </Layer>
            </Stage>
          </div>
        </DivImg>
        <div>
          <DivLabels> Labels </DivLabels> <DivRestrs> Restriction </DivRestrs>
        </div>
      </div>
    )
  }
}
export default LabelingContent
