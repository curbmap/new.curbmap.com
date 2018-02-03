import React, { Component } from 'react'
import { Rect, Group } from 'react-konva'
import _ from 'lodash'
import labels from './Labels'

class LabelBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fill: null,
      strokeWidth: 5,
      stroke: 'black',
      opacity: 0.5,
      coverRect: null,
      mouseDown: null,
    }
    // so we can access props and state in handleClick
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
  }
  componentDidMount() {
    this.getColorFromProp(this.props.type)
    this.setState({ id: this.props.id })
  }
  getColorFromProp(type) {
    switch (type) {
      case labels.not_interesting:
        this.setState({ stroke: '#000000' })
        break
      case labels.permament_permit_sign:
        console.log('permit')
        this.setState({ stroke: '#f0f0f0' })
        break
      case labels.permanent_bus_stop_sign:
        this.setState({ stroke: '#c00000' })
        break
      default:
        break
    }
  }
  handleMouseMove(e) {
    if (this.state.mouseDown != null) {
      this.props.onDrag(this.props.id, {
        mouseDown: this.state.mouseDown,
        mouseUp: { x: e.evt.layerX, y: e.evt.layerY },
      })
    }
    if (
      e.evt.layerX <= 5 ||
      e.evt.layerX >= this.props.x + this.props.width + 1 ||
      e.evt.layerY <= 5 ||
      e.evt.layerY >= this.props.y + this.props.height + 1
    ) {
      this.handleMouseUp(e)
    }
  }

  handleMouseDown(e) {
    console.log(e)
    this.setState({
      mouseDown: { x: e.evt.layerX, y: e.evt.layerY },
    })
  }

  handleMouseUp(e) {
    this.state.mouseDown = null
    this.forceUpdate()
  }

  render() {
    return (
      <Group id={this.props.id}>
        <Rect
          x={this.props.x}
          y={this.props.y}
          width={this.props.width}
          height={this.props.height}
          fill={this.state.fill}
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.handleMouseMove}
          onMouseUp={this.handleMouseUp}
          onDragEnd={this.handleMouseUp}
          onClick={this.handleMouseUp}
          stroke={this.state.stroke}
          strokeWidth={this.state.strokeWidth}
          listening
        />
        {this.state.coverRect}
      </Group>
    )
  }
}

export default LabelBox
