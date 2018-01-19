import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import styled from 'styled-components'
import labels from '../labeling/Labels'

const DivImg = styled.div`
  border: 1px solid black;
  width: 70vw;
  height: 100vh;
  float: left;
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
      div: null,
      drawingBox: false,
      boxes: [],
      labels: [],
      restrs: [],
      selectedBoxIndex: null,
      currentBoxTopLeft: { x: null, y: null },
      currentBoxBottomRight: { x: null, y: null },
      currentBoxLabel: '',
      currentBoxRestr: {},
      mouseLocation: { x: null, y: null },
    }
  }

  changeDrawingBoxState(drawingState) {
    this.setState({ drawingBox: drawingState })
  }

  beginDrawingBox(existingBox) {
    this.changeDrawingBoxState(true)
    if (!this.state.existingBox) {
      // create a box
      this.setState({
        currentBoxBottomRight: this.state.mouseLocation,
        currentBoxTopLeft: this.state.mouseLocation,
      })
    }
  }

  drawBox() {
    // i.e. if mousedown (a current box must have already been created!)
    if (this.state.drawingBox) {
      if (
        this.state.currentBoxTopLeft.x > this.state.currentBoxBottomRight.x &&
        this.state.currentBoxTopLeft.y > this.state.currentBoxBottomRight.y
      ) {
        // swap top left and bottom right if when drawing/dragging an already created box, the corners change.
        this.setState({
          currentBoxBottomRight: this.state.currentBoxTopLeft,
          currentBoxTopLeft: this.state.currentBoxBottomRight,
        })
      }
      if (
        this.state.mouseLocation.x < this.state.currentBoxTopLeft.y &&
        this.state.mouseLocation.y < this.state.currentBoxTopLeft.y
      ) {
        this.setState({
          currentBoxTopLeft: this.state.mouseLocation,
        })
      } else {
        this.setState({
          currentBoxBottomRight: this.state.mouseLocation,
        })
      }
    }
  }

  selectBox(location) {
    let idx = -1
    const selected = this.state.boxes.map((val, index, _) => {
      // this should really be housed in like K-d tree, but since this is JS we are using an array :-(
      // Find if you have clicked within 5 of a corner of a box in the list
      if (
        (location.x >= val.x1 - 5 &&
          location.x <= val.x1 + 5 &&
          location.y >= val.y1 - 5 &&
          location.y <= val.y1 + 5) ||
        (location.x >= val.x2 - 5 &&
          location.x <= val.x2 + 5 &&
          location.y >= val.y2 - 5 &&
          location.y <= val.y2 + 5)
      ) {
        idx = index
        return val
      }
      return false
    })
    if (selected.length == 1) {
      this.state.boxes.splice(idx)
      this.setState({
        selectedBoxIndex: idx,
        currentBoxTopLeft: { x: selected[0].x1, y: selected[0].y1 },
        currentBoxBottomRight: { x: selected[0].x2, y: selected[0].y2 },
        currentBoxLabel: this.state.labels[idx],
      })
    }
  }
  selectLabel(index) {
    this.setState({
      currentBoxLabel: this.state.labels[index],
    })
  }

  handleMouseDown(event) {
    if (this.state.div != null) {
      const x = event.pageX - this.state.div.x
      const y = event.pageY - this.state.div.y
      this.selectBox({ x, y })
    }
  }

  handleMouseUp(event) {
    console.log('xxx')
  }

  handleMouseMove(event) {
    if (this.state.drawingBox) {
      // this.mouseLocation = event
    }
  }

  handleDiv(element) {
    if (ReactDOM.findDOMNode(element)) {
      const boundingRect = ReactDOM.findDOMNode(element).getBoundingClientRect()
      this.state.div = boundingRect
    }
  }

  render() {
    return (
      <div>
        <br />
        <DivImg
          onMouseDown={e => this.handleMouseDown(e)}
          onMouseUp={e => this.handleMouseUp(e)}
          ref={(input) => {
            this.handleDiv(input)
          }}
        >
          Content Image
        </DivImg>
        <div>
          <DivLabels>Labels</DivLabels>
          <DivRestrs>Restriction</DivRestrs>
        </div>
      </div>
    )
  }
}

export default LabelingContent
