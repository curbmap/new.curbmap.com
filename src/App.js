import React, { Component } from 'react'
import logo from './logo.svg'
import { injectGlobal } from 'styled-components'
import './App.css'
import Labeling from './Components/labeling'

class App extends Component {
  somefunction() {
    const x = this.context
    //
  }
  render() {
    return <Labeling />
  }
}

export default App
