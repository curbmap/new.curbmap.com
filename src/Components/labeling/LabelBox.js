import React, { Component } from 'react';
import { Rect, Group } from 'react-konva';
import _ from 'lodash';
import labels from './Labels';

class LabelBox extends Component {
  constructor(...props) {
    super(...props);
    console.log(props);
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
    console.log(this.state.stroke);
    this.setState({ id: this.props.id });
    console.log(this.state.stroke);
  }
  componentDidMount() {
  }
  getColorFromProp() {
    console.log("TYPE:", this.props.type);
    switch (this.props.type) {
      case labels.not_interesting:
        return('#000000');
        break;
      case labels.permament_permit_sign:
        console.log('permit');
        return('#f0f0f0');
        break;
      case labels.permanent_bus_stop_sign:
        return('#c08989');
        break;
      case labels.blue_curb:
        return('#0000FF');
        break;
      case labels.green_curb:
        return('#00FF00');
      case labels.red_curb:
        return('#FF0000');
        break;
      case labels.hydrant:
        return('#FF0000');
        break;
      case labels.meter:
        return('#FF00FF');
        break;
      case labels.permanent_meter_sign:
        return('#FF00FF');
        break;
      case labels.permanent_no_drop_off_pick_up_sign:
        return('#ffff90');
        break;
      case labels.permanent_no_parking_sign:
        return('#FF0000');
        break;
      case labels.permanent_no_stopping_sign:
        return('#FF0000');
        break;
      case labels.permanent_other_sign:
        return('#FFFF00');
        break;
      case labels.permanent_private_parking_sign:
        return('#000000');
        break;
      case labels.permanent_street_sign:
        return('#00AA00');
        break;
      case labels.permanent_time_limit_sign:
        return('#CCCCCC');
        break;
      case labels.temporary_no_parking_sign:
        return('#FF0000');
        break;
      case labels.temporary_no_stopping_sign:
        return('#FF0000');
        break;
      case labels.temporary_other_sign:
        return('#A0A000');
        break;
      case labels.temporary_permit_sign:
        return('#c0ffc0');
        break;
      case labels.temporary_time_limit_sign:
        return('#CCCCCC');
        break;
      case labels.white_curb:
        return('#FFFFFF');
        break;
      case labels.yellow_curb:
        return('#FFFF00');
        break;
      default:
        break;
    }
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
