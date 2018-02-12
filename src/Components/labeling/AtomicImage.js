// http://jsbin.com/lolegegaco/edit?js,output
import React, { Component } from "react";
import { Image } from "react-konva";

class AtomicImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: new window.Image()
    };
  }
  
  componentDidMount() {
    this.state.image.src = this.props.src;
    console.log(this.state.image.src);
    this.imageNode.getLayer().batchDraw();
  }
  render() {
    return (
      <Image
        image={this.state.image}
        width={this.props.width}
        height={this.props.height}
        onDrag={this.props.onDrag}
        onClick={this.props.onMouseDown}
        onMouseDown={this.props.onMouseDown}
        ref={node => {
          this.imageNode = node;
        }}
      />
    );
  }
}

export default AtomicImage;
