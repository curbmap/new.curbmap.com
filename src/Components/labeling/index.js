import React, { Component } from 'react'
import { connect } from 'react-redux'
import Sidebar from 'react-sidebar'
import styled, { injectGlobal } from 'styled-components'
import _ from 'lodash'
import LabelingContent from './LabelingContent'
// import * as ActionCreators from '../../Actions'

const SidebarDiv = styled.div`
  width: 20vw;
  height: 100vh;
  font-family: Poppins-Regular;
  background: rgba(100, 100, 100, 80);
  color: white;
  padding: 1vh;
`

class Labeling extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sidebarOpen: true,
    }

    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this)
  }
  onSetSidebarOpen(open) {
    this.setState({ sidebarOpen: open })
  }
  handleKeyPress(event) {
    if (event.key == 'c') {
      // create a box
      // send of an action to be reduced in the LabelingContent panel
    } else if (event.key == 'q') {
      console.log('ESCAPE')
    }
  }
  render() {
    const sidebarContent = (
      <SidebarDiv>
        {' '}
        <br />
        Sidebar content
        <br />
        <div />
      </SidebarDiv>
    )

    return (
      <div onKeyPress={this.handleKeyPress}>
        <Sidebar
          sidebar={sidebarContent}
          open={this.state.sidebarOpen}
          onSetOpen={this.onSetSidebarOpen}
        >
          <LabelingContent />
        </Sidebar>
      </div>
    )
  }
}

export default Labeling
