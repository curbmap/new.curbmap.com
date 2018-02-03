import React, { Component } from 'react'
import './App.css'
import Labeling from './Components/labeling'

class App extends Component {
  somefunction() {
    const x = this.context
    //
  }
  render() {
    return <Labeling username="curbmaptest" session="x" />
  }
}

export default App
