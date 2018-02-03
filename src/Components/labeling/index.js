import React, { Component } from 'react'
import { connect } from 'react-redux'
import Sidebar from 'react-sidebar'
import styled from 'styled-components'
// import _ from 'lodash'
import LabelingContent from './LabelingContent'
// import * as ActionCreators from '../../Actions'

const request = require('superagent')

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
      image:
        'https://curbmap.com:50003/uploads/03673a00-ef23-11e7-903b-8d9a8c07e4d0-1517445504563-85632QW7+RMJC-102.443206787109.jpg',
    }

    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this)
  }
  onSetSidebarOpen(open) {
    this.setState({
      sidebarOpen: open,
    })
  }
  handleKeyPress(event) {
    console.log(event)
    if (event.key === 'c') {
      console.log('create new box')

      // create a box
      // send of an action to be reduced in the LabelingContent panel
    } else if (event.key === 'd') {
      console.log('right')
    } else if (event.key === 'q') {
      console.log('ESCAPE')
    }
  }

  getImage() {
    request
      .get('https://curbmap.com:50003/getPhoto')
      .set('session', this.props.session)
      .set('username', this.props.username)
      .set('Accept-Encoding', 'deflate, gzip;q=1.0, *;q=0.5')
      .then(this.gotImage)
  }
  gotImage(res) {
    console.log(res)
  }
  render() {
    const sidebarContent = (
      <SidebarDiv>
        {' '}
        <br />
        Sidebar content <br />
        <div />
      </SidebarDiv>
    )
    return (
      <div onKeyPress={e => this.handleKeyPress(e)}>
        <Sidebar
          sidebar={sidebarContent}
          open={this.state.sidebarOpen}
          onSetOpen={this.onSetSidebarOpen}
        >
          <LabelingContent image={this.state.image} />
        </Sidebar>
      </div>
    )
  }
}

export default Labeling
