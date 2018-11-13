import React, { Component, Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import actions from '@/actions'
import Webcam from 'react-webcam'
import socket from '@/socketio'

import '@/styles/photoSearch.styl'
import person from '@/images/person.png'

import SearchStudent from '../SearchStudent'

class Photo extends Component {
  constructor (props) {
    super(props)
    this.searchText = ''

    this.refImage = React.createRef()
    this.refTagSearch = React.createRef()
    this.refTagMatch = React.createRef()
    this.refTagNoMatch = React.createRef()
    this.btnNext = React.createRef()

    this.state = {
      next: false,
      errorCamera: false,
      errorInputSearch: false,
      showCamera: true,
      data: [],
      redirectProfile: false
    }
  }

  componentDidMount () {
    // this.props.dispatch({ type: 'SET_LOCATION', location: this.props.location.pathname })
    socket.connect()
    this.props.dispatch(actions.resetStore())
    this.props.dispatch({ type: 'SET_ERRORSEARCH', error: false })
    this.props.dispatch({ type: 'SET_TAB', tab: '/searchStudent/photo' })
    
  }

  componentWillUnmount() {
    socket.disconnect()
  }

  componentDidUpdate (preProps) {
    if (preProps.photoSearchMatch !== this.props.photoSearchMatch) {
      if (this.props.photoSearchMatch === 'match' && !this.state.next) {
        this.refTagSearch.current.style.display = 'none'
        this.refTagMatch.current.style.display = 'flex'
        this.btnNext.current.classList.add('show')
        this.refTagNoMatch.current.style.display = 'none'
      } else if (this.props.photoSearchMatch === 'noMatch' && !this.state.next) {
        this.refTagSearch.current.style.display = 'none'
        this.refTagMatch.current.style.display = 'none'
        this.refTagNoMatch.current.style.display = 'flex'
      }
    }

    if (preProps.errorSearch !== this.props.errorSearch && this.props.errorSearch) {
      this.setState({errorInputSearch: true})
    }

    if (preProps.studenFound !== this.props.studenFound) {
      this.setState({data:[this.props.studenFound]})
    }
  }

  setRef = webcam => this.webcam = webcam

  
  capture = () => {
    this.refTagSearch.current.style.display = 'flex'
    this.refTagMatch.current.style.display = 'none'
    this.refTagNoMatch.current.style.display = 'none'
    this.props.dispatch({ type: 'SET_PHOTOSEARCHMATCH', photoSearchMatch: 'none' })

    const img_b64 = this.webcam.getScreenshot()

    const png = img_b64.split(',')[1]
    const binary = this.fixBinary(window.atob(png))  // We use the function "fixBinary"
    const the_file = new Blob([binary], {type: 'image/png'})  // We take out the encode encode
    const photo = new File([the_file], 'photo.png', { type: 'image/png' })  // We create the file

    const data = { student_id: socket.get_id(), ext: 'png', type: 'faceSearch' }
    this.props.dispatch(actions.getUrlSearch(data, photo))
  
    this.props.dispatch({ 
      type: 'SAVE_PHOTOSEARCH',
      dataImage: this.webcam.getScreenshot()
    })
    
    this.refImage.current.style.display = 'flex'
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
    this.setState({errorCamera: true})
  }

  handleNext = () => {
    this.setState({next: true})
  }

  handleChangeInput = (e) => {
    const value = e.target.value
    this.searchText = value
  }

  searchStudent = () => {
    if (this.searchText) {
      this.setState({showCamera: false, errorInputSearch: false})
      this.props.dispatch({ type: 'SET_ERRORSEARCH', error: false })
      this.props.dispatch(actions.searchStudent(this.searchText, this.props.token))
    } else {
      this.setState({errorInputSearch: true})
    }
  }

  handleProfile = (e) => {
    const id = e.target.id
    this.props.dispatch(actions.getProfile(id))
    setTimeout(() => {this.setState({redirectProfile: true})}, 500)
  }


  render () {
    const videoConstraints = {
      facingMode: 'user'
    }
    let showBtnNext = false
    if (this.props.photoSearchMatch === 'match') {showBtnNext = true}
    return (
      <Fragment>
        {this.state.redirectProfile ? (
          <Redirect to='/searchStudent/info' />
        ) : (
          <Fragment>
            {!this.state.next ? (
              <SearchStudent>

                <div className='row'>
                  <div className='col-1' />
                  <div className='col-10 containerMatch'>
                    
                    <div className={this.props.login ? 'row' : 'hidden'}>>
                      <p className="title">Search by surname or email</p>
                      <div className="col-10 offset-1 mb-5">
                        <input
                          type='text'
                          className={this.state.errorInputSearch ? 'col-8 inputSearch errorInput': 'col-8 inputSearch'}
                          placeholder='surname or email'
                          onChange={this.handleChangeInput}
                        />
                        <button
                          className={this.state.errorInputSearch ? 'btnNext btnSearchStudent errorBtn': 'btnNext btnSearchStudent'}
                          onClick={this.searchStudent}
                        >SEARCH
                        </button>
                      </div>
                    </div>

                    {this.state.showCamera ? (
                      <Fragment>
                        
                        <p className='title'>Take photo to start the search</p>

                        <div className='displaySearch'>
                          <div
                            className={this.state.errorCamera ? 'cameraSearch cameraError' : "cameraSearch"}
                          >
                            <Webcam
                              audio={false}
                              ref={this.setRef}
                              screenshotFormat='image/png'
                              videoConstraints={videoConstraints}
                              onUserMediaError={this.handleErrorCamera}
                            />
                          </div>

                          <div className='photoSearch' ref={this.refImage}>
                            <img
                              id='imgPhoto'
                              src={this.props.photo}
                              alt='image'
                            />
                          </div>

                          <div
                            className={this.state.errorCamera ? "errorCamera show" : "errorCamera"}
                          >ERROR</div>

                          <div
                            className={this.state.errorCamera ? "messageError" : "hidden"}
                          >
                            <p className='labelError'>
                              <i className="fas fa-camera-retro" style={{fontSize: '30px'}} />
                            </p>
                            <p className='labelError' style={{fontSize: '18px'}}>
                              No camera is connected
                            </p>
                          </div>

                          <div className="tagSearch" ref={this.refTagSearch}>
                            <div className="myloader">Loading...</div>
                            <span style={{marginLeft: '7px'}}>Search</span>
                          </div>
                          <div className="tagSearch" ref={this.refTagMatch}>
                            <span style={{marginLeft: '7px'}}>Match!</span>
                          </div>
                          <div className="tagSearch" id='noMatch' ref={this.refTagNoMatch}>
                            <span style={{marginLeft: '7px'}}>No Match!</span>
                          </div>
                        </div>

                        <button
                          className='btnNext'
                          id='btnCapture'
                          onClick={this.capture}
                        >CAPTURE PHOTO
                        </button>

                        <button
                          className='btnNextSearch'
                          id='btnPhotoSearch'
                          onClick={this.handleNext}
                          ref={this.btnNext}
                        >NEXT
                        </button>
                      </Fragment>
                    ):(
                      <div className="row">
                        <div className="col-10 offset-1">
                          {this.state.data.map((dato, i) => (
                            <div className="itemTable" key={i}>
                              <img src={person} alt="person" id='photoList'/>
                              <p
                                id={dato._id}
                                className='linkProfile'
                                onClick={this.handleProfile}
                              >{dato.name}</p>
                              <p>{dato.email}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </SearchStudent>
            ) : (
              <Redirect to='/searchStudent/otp' />
            )}
          </Fragment>
        )}
      </Fragment>
    )
  }
}

function mapStateToProps (state, props) {
  return {
    registration: state.registration,
    photo: state.photoSearch,
    photoSearchMatch: state.photoSearchMatch,
    login: state.login,
    token: state.token,
    errorSearch: state.errorSearch,
    studenFound: state.studenFound
  }
}

export default connect(mapStateToProps)(Photo)
