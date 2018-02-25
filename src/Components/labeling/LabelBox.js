import React, { Component } from "react";
import { Rect, Group } from "react-konva";

class LabelBox extends Component {
  constructor(...props) {
    super(...props);
    this.state = {
      fill: null,
      strokeWidth: 5,
      stroke: "yellow",
      opacity: 0.5
    };
    // so we can access props and state in handleClick
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
  }
  componentWillMount() {
    this.setState({ id: this.props.id });
  }
  componentDidMount() {}
  getColorFromProp() {
    let color = this.props.type.color;
    return color;
  }

  handleMouseDown(e) {
    this.props.movingRect(this.props.id);
  }

  handleMouseUp(e) {
    this.props.stoppedMovingRect(this.props.id);
  }
  handleDoubleClick(e) {
    e.evt.preventDefault();
    e.cancelBubbles = true;
    this.props.doubleClick(e, this.props.id);
  }

  render() {
    return (
      <Group id={this.props.id} key={this.props.key}>
        <Rect
          x={this.props.x}
          y={this.props.y}
          width={this.props.width}
          height={this.props.height}
          fill={this.state.fill}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          onDblClick={this.handleDoubleClick}
          stroke={this.getColorFromProp()}
          strokeWidth={this.state.strokeWidth}
          type={this.state.type}
          listening
        />
      </Group>
    );
  }
}

export default LabelBox;
