import React, { Component } from 'react';
import { Rect, Group } from 'react-konva';
import labels from './Labels';

class LabelBox extends Component {
  constructor(...props) {
    super(...props);
    this.state = {
      fill: null,
      strokeWidth: 5,
      stroke: 'yellow',
      opacity: 0.5,
    };
    // so we can access props and state in handleClick
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
  }
  componentWillMount() {
    this.setState({ id: this.props.id });
  }
  componentDidMount() {
  }
  getColorFromProp() {
    let color = this.props.type.color;
    return(color);
  }

  handleMouseDown(e) {
    console.log('mouse down box', e);
    this.props.movingRect(this.props.id);
  }

  handleMouseUp(e) {
    console.log('mouse up box', e);
    this.props.stoppedMovingRect(this.props.id);
    this.state.mouseDown = null;
  }
  handleDoubleClick(e) {
    console.log("in box dbl", e);
    e.evt.preventDefault();
    e.cancelBubbles = true;
    this.props.doubleClick(e, this.props.id);
  }

  render() {
    return (<Group id ={this.props.id}>
          <Rect x= {this.props.x}
              y ={this.props.y}
              width ={this.props.width}
              height ={this.props.height}
              fill= {this.state.fill}
              onMouseDown ={this.handleMouseDown}
              onMouseUp= {this.handleMouseUp}
              onDblClick = {this.handleDoubleClick}
              stroke={this.getColorFromProp()}
              strokeWidth= {this.state.strokeWidth}
              type={this.state.type}
              listening
            />
        </Group>
    );
  }
}

export default LabelBox;
