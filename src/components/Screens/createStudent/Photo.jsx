import React, { Component, Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import Webcam from 'react-webcam'
import actions from '@/actions'
import $ from 'jquery'
import '@/styles/photo.styl'

import CreateStudent from '../CreateStudent'
import person from '@/images/person.png'


class Photo extends Component {
  constructor (props) {
    super(props)
    this.refCamera = React.createRef()
    this.refErrorCamera = React.createRef()
    this.refMessageError = React.createRef()
    this.refProcessing = React.createRef()
    this.refMatched = React.createRef()
    this.refNoMatch = React.createRef()
    
    this.state = {
      submit: false,
    }
  }

  componentDidMount () {
    this.props.dispatch({ type: 'SET_LOCATION', location: this.props.location.pathname })
    this.props.dispatch({ type: 'SET_DISABLE_TAG', name: 'student' })
  }

  componentDidUpdate () {
    if (this.props.photoMached === true && !this.state.submit) {
      this.refMatched.current.style.display = 'flex'
      this.refNoMatch.current.style.display = 'none'
    } else if (!this.props.photoMached && !this.state.submit) {
      this.refMatched.current.style.display = 'none'
      this.refNoMatch.current.style.display = 'flex'
    }
  }

  handleNext = () => {
    this.props.dispatch({ type: 'SET_DISABLE_TAG', name: 'photo' })
    this.setState({submit: true})
  }

  setRef = webcam => this.webcam = webcam

  capture = () => {
    this.refMatched.current.style.display = 'none'
    this.refNoMatch.current.style.display = 'none'
    this.refProcessing.current.style.display = 'flex'
    this.props.dispatch({ type: 'SET_PHOTOMACHED', photoMached: 'none' })

    const img_b64 = this.webcam.getScreenshot()

    const png = img_b64.split(',')[1]
    const binary = this.fixBinary(window.atob(png))  // We use the function "fixBinary"
    const the_file = new Blob([binary], { type: 'image/png' })  // We take out the encode encode
    const photo = new File([the_file], 'photo.png', { type: 'image/png' })  // We create the file

    const data = { ...this.props.registration, ext: 'png', type: 'photoMatch' }
    this.props.dispatch(actions.getUrl(data, photo, this.props.token))

    const dataImage = { side: 'photo', image: this.webcam.getScreenshot() }
    this.props.dispatch({ type: 'SAVE_IMAGE', dataImage })
  }

  fixBinary = (bin) => {
    const length = bin.length;
    const buf = new ArrayBuffer(length)
    const arr = new Uint8Array(buf)
    for (let i=0 ; i<length ; i++) {
      arr[i] = bin.charCodeAt(i)
    }
    return buf
  }

  handleErrorCamera = () => {
    this.refCamera.current.style.borderColor = '#F8614E'
    this.refErrorCamera.current.style.display = 'flex'
    this.refMessageError.current.style.display = 'block'
  }

  render () {
    const videoConstraints = {
      facingMode: 'user'
    }
    return (
      <Fragment>
        {this.props.login ? (
          <Fragment>
            {!this.state.submit ? (
              <CreateStudent>
                <div className="row">
                  <div className="col-1" />
                  <div className="col-10 containerPhoto" style={{borderRadius: '2px'}}>
                    <p className='title'>Take a live picture of the student</p>

                    <div className="containerDisplay">
                      <div className="col-6">
                        <div className="camera" id='camera' ref={this.refCamera}>
                          <Webcam
                            audio={false}
                            ref={this.setRef}
                            screenshotFormat="image/png"
                            videoConstraints={videoConstraints}
                            onUserMediaError={this.handleErrorCamera}
                          />

                          <div className="errorCameraPhoto" ref={this.refErrorCamera}>ERROR</div>

                          <div className="messageErrorPhoto" ref={this.refMessageError}>
                            <p className='labelError'>
                              <i className="fas fa-camera-retro" style={{fontSize: '30px'}} />
                            </p>
                            <p className='labelError' style={{fontSize: '18px'}}>
                              No camera is connected
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-6">
                        <div className="photo" id='photo'>
                          <img id='imgPhoto' src={this.props.photo} alt="image" />
                        </div>
                      </div>

                      <div className="labelProcessing" ref={this.refProcessing}>
                        <div className="myloader">Loading...</div>
                        <span style={{marginLeft: '7px'}}>Processing</span>
                      </div>

                      <div className="labelProcessing" ref={this.refMatched}>
                        <span style={{marginLeft: '7px'}}>Match!</span>
                      </div>
                      <div className="labelProcessing" id='noMatch' ref={this.refNoMatch}>
                        <span style={{marginLeft: '7px'}}>No Match!</span>
                      </div>

                    </div>

                    <button className='btnNext' id='btnCapture' onClick={this.capture}>CAPTURE PHOTO</button>
                    <button
                      className={this.props.photoMached === true ? 'btnNext' : 'hidden'}
                      id='btnPhoto'
                      onClick={this.handleNext}
                    >NEXT</button>
                  
                  </div>
                  <div className="col-1" />
                </div>

              </CreateStudent>
            ) : (
              <Redirect to='/createStudent/attachments' />
            )}
          </Fragment>
        ) : (
          <Redirect to="/" />
        )}
      </Fragment>
    )
  }
}

function mapStateToProps (state, props) {
  return {
    registration: state.registration,
    photo: state.photo,
    photoMached: state.photoMached,
    login: state.login,
    token: state.token
  }
}

export default connect(mapStateToProps)(Photo)

$(document).ready(function($){
  let width = $("#camera").width()
  $("#photo").height(width*0.9)
  $("#camera").height(width*0.9)
  $(".containerDisplay").height(width)
  $("#imgPhoto").height('84%')
  $("#imgPhoto").width('100%')
  
  $(window).resize(function() {
    width = $("#camera").width()
    $("#photo").height(width*0.9)
    $("#camera").height(width*0.9)
    $(".containerDisplay").height(width)
  })
})
