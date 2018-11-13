import React, { Component, Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import actions from '@/actions'
import '@/styles/attachments.styl'

import CreateStudent from '../CreateStudent'

class Attachments extends Component {
  constructor (props) {
    super(props)
    this.inputFile = React.createRef()

    this.state = {
      submit: false,
      files: []
    }
  }

  componentDidMount () {
    this.props.dispatch({ type: 'SET_LOCATION', location: this.props.location.pathname })
    this.props.dispatch({ type: 'SET_DISABLE_TAG', name: 'photo' })
  }

  handleAttachments = () => {
    this.setState({submit: true})
    this.props.dispatch({ type: 'SET_DISABLE_TAG', name: 'attachments' })
    this.props.dispatch({ type: 'SET_FILES', files: this.state.files })
  }

  handleDeleteFile = (e) => {
    let files = this.state.files
    // clear input field
    this.inputFile.current.value = ''
    let idx = files.indexOf(e.target.id)
    files.splice(idx, 1)
    this.setState({files})
  }

  handleUploadFile = (e) => {
    const input = e.nativeEvent.srcElement
    const file = input.files[0]
    const name = file.name
    const ext = name.split('.')[1]
    const data = {...this.props.registration, ext, type: 'attachment'}
    
    let files = this.state.files
    files.push(name)
    this.setState({files})
    
    const reader = new FileReader()
    reader.readAsDataURL(input.files[0])

    reader.onload = () => {
      const id = this.props.registration.student_id
      this.props.dispatch(actions.sendDataFile(name, ext, id, file, this.props.token))
      // this.props.dispatch(actions.getUrl(data, file, this.props.token))
    }
  }

  render () {
    return (
      <Fragment>
        {this.props.login ? (
          <Fragment>
            {!this.state.submit ? (
              <CreateStudent>
                
                <div className="row">
                  <div className="col-1" />
                  <div className="col-10 cotainerAttachments" style={{borderRadius: '2px'}}>
                    <p className='title'>Upload complimentary documents needed.</p>

                    <div className="row">
                      <div className="col-1" />
                      <div className="col-10">
                        <input
                          onChange={this.handleUploadFile}
                          type="file"
                          name="myFile"
                          id="file-upload"
                          style={{display: 'none'}}
                          ref={this.inputFile}
                        />
                        <label htmlFor="file-upload" className="containerUpload">
                          <p className='labelUpload'>
                            <i className="far fa-arrow-alt-circle-up" style={{fontSize: '30px'}} />
                          </p>
                          <p className='labelUpload'>
                            Click to upload complimentary documents
                          </p>
                        </label>

                        <ul className="containerList">
                          {this.state.files.map((file, i) => (
                            <li className='fileItem' key={i}>
                              <p className='fileName'>
                                <span
                                  id={file}
                                  className='iconDelete'
                                  onClick={this.handleDeleteFile}
                                >&times;</span> {file}
                              </p>
                            </li>
                          ))}
                        </ul>                  
                      </div>
                      <div className="col-1" />
                    </div>

                    <div className="containerBtn row">
                      <div className="col-1" />
                      <div className="col-10">
                        <button
                          className='btnNext'
                          id='btnAttachments'
                          onClick={this.handleAttachments}
                        >NEXT</button>
                      </div>
                      <div className="col-1" />
                    </div>

                  </div>

                  <div className="col-1" />
                </div>

              </CreateStudent>
            ) : (
              <Redirect to='/createStudent/review' />
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
    login: state.login,
    token: state.token
  }
}

export default connect(mapStateToProps)(Attachments)
