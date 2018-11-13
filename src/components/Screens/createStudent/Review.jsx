import React, { Component, Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import actions from '@/actions'
import '@/styles/showInfo.styl'
import person from '@/images/person.png'

import CreateStudent from '../CreateStudent'

class Review extends Component {
  constructor (props) {
    super(props)
    this.refTab1 = React.createRef()
    this.refTab2 = React.createRef()

    this.nameFront = React.createRef()
    this.nameBack = React.createRef()

    this.refContainerCanvasFront = React.createRef()
    this.refCanvasFront = React.createRef()
    this.refContainerCanvasBack = React.createRef()
    this.refCanvasBack = React.createRef()

    let matched = {}
    const infoMatched = this.props.infoMatched
    Object.keys(infoMatched).forEach((key) => {
      const value = infoMatched[key]
      if (value !== 'Delete') {
        matched[value] = key
      }
    })

    this.state = {
      tabActive: 'tab1',
      submit: false,
      matched
    }
  }

  componentDidMount () {
    this.props.dispatch({ type: 'SET_LOCATION', location: this.props.location.pathname })
    const tabActive = this.state.tabActive
    if (tabActive === 'tab1') {
      this.handleChangeTab1()
    } else {
      this.handleChangeTab2()
    }

    if (tabActive === 'tab1' && this.props.imageFront) {
      this.showImage(this.props.imageFront, 'tab1')
    } else if (tabActive === 'tab1' && !this.props.imageFront) {
      this.showImage(person, 'tab1')
    } else if (tabActive === 'tab2' && this.props.imageBack) {
      this.showImage(this.props.imageBack, 'tab2')
    } else if (tabActive === 'tab2' && !this.props.imageBack) {
      this.showImage(person, 'tab2')
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.submit) return

    const tab = this.state.tabActive
    /* Change of tab */
    if (tab !== prevState.tabActive) {
      const containerCanvasFront = this.refContainerCanvasFront.current
      const containerCanvasBack = this.refContainerCanvasBack.current

      if (tab === 'tab1' && !this.props.imageFront) {
        containerCanvasFront.style.display = 'flex'
        containerCanvasBack.style.display = 'none'
        this.showImage(person, 'tab1')
      }
      else if (tab === 'tab1' && this.props.imageFront) {
        containerCanvasFront.style.display = 'flex'
        containerCanvasBack.style.display = 'none'
        this.showImage(this.props.imageFront, 'tab1')
      }
      else if (tab === 'tab2' && !this.props.imageBack) {
        containerCanvasFront.style.display = 'none'
        containerCanvasBack.style.display = 'flex'
        this.showImage(person, 'tab1')
      }
      else if (tab === 'tab2' && this.props.imageBack) {
        containerCanvasFront.style.display = 'none'
        containerCanvasBack.style.display = 'flex'
        this.showImage(this.props.imageBack, 'tab2')
      }
    }
  }

  handleChangeTab1 = () => {
    const tab1 = this.refTab1.current
    const tab2 = this.refTab2.current
    const nameFront = this.nameFront.current
    const nameBack = this.nameBack.current

    console.log('tab1')
    this.setState({tabActive: 'tab1'})
    tab1.classList.add("tabActive")
    tab2.classList.remove("tabActive")
    nameBack.style.display = 'none'
    if (this.props.nameFront !== '') {
      nameFront.style.display = 'block'
    }
  }

  handleChangeTab2 = () => {
    const tab1 = this.refTab1.current
    const tab2 = this.refTab2.current
    const nameFront = this.nameFront.current
    const nameBack = this.nameBack.current
    
    console.log('tab2')    
    this.setState({tabActive: 'tab2'})

    tab1.classList.remove("tabActive")
    tab2.classList.add("tabActive")
    nameFront.style.display = 'none'
    if (this.props.nameBack !== '') {
      nameBack.style.display = 'block'
    }
  }

  showImage = (file, tab) => {
    let canvas
    const containerCanvasFront = this.refContainerCanvasFront.current
    const containerCanvasBack = this.refContainerCanvasBack.current
    
    // I verify which tab is active
    if (tab === 'tab1') {
      console.log('tab1')
      canvas = this.refCanvasFront.current
      containerCanvasFront.style.display = 'flex'
      containerCanvasBack.style.display = 'none'
    } else {
      console.log('tab2')
      canvas = this.refCanvasBack.current
      containerCanvasFront.style.display = 'none'
      containerCanvasBack.style.display = 'flex'
    }

    // I drawing picture in canvas
    let ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    let filePreview = document.createElement('img')
    filePreview.src = file
    filePreview.onload = () => {
      // vertical
      let width = 220
      let height = 300
      let x = 40
      let y = 0
      const height0 = filePreview.height
      const width0 = filePreview.width
      if (width0>height0) {
        // horizontal
        width = 300
        height = 220
        x = 0
        y = 40
      }
      ctx.drawImage(filePreview, x, y, width, height)
    }
  }

  handleSubmit = () => {
    this.props.dispatch(actions.approveStudent(this.props.registration.student_id, this.props.token))
    this.setState({submit: true})
  }

  render () {
    return (
      <Fragment>
        {this.props.login ? (
          <Fragment>
            {!this.state.submit ? (
              <CreateStudent>

                <div className='row'>
                  <div className='col-1' />
                  <div className='col-10 containerInfo' style={{borderRadius: '2px'}}>
                    <p className='titleInfo'>STUDENT INFO</p>

                    <div className='row'>
                      <div className='col-1' />
                      <div className='col-10'>
                        <div className='row textEmail'>

                          <i className='far fa-user' style={{fontSize: '38px'}}/>
                          <div>
                            <p style={{color: '#49C379'}}>Email</p>
                            <p>{this.props.email}</p>
                          </div>
                        </div>

                        <div className='row infoUser'>
                          <div className='col-3 imgUser'>
                            <img src={this.props.photo} alt='id' className='imageID' />
                          </div>
                          <div className='col contentItem'>
                            {Object.keys(this.state.matched).map((item, i) => (
                              <div style={{width: '50%', 'marginBottom': '10px'}} key={i}>
                                <p style={{color: '#49C379'}}>{item}</p>
                                <p style={{color: 'white'}}>{this.state.matched[item]}</p>
                              </div>
                            ))}

                          </div>
                        </div>
                       
                      </div>
                      <div className='col-1' />
                    </div>

                    <p className='titleInfo' id='id'>IDs</p>

                    <div className='row'>
                      <div className='col-1' />
                      <div className='col-10'>

                        <div className='containerTabs'>
                          <div
                            className='tab1 tabActive'
                            id='tab1'
                            onClick={this.handleChangeTab1}
                            ref={this.refTab1}
                          >FRONT</div>
                          <div
                            className='tab2'
                            id='tab2'
                            onClick={this.handleChangeTab2}
                            ref={this.refTab2}
                          >BACK</div>
                        </div>

                        <div className='row containerScan'>
                        
                          <div className='col-1' />
                          <div className='col-10'>
                            <div className='scanFront' style={{display: 'none'}} ref={this.refContainerCanvasFront}>
                              <canvas
                                ref={this.refCanvasFront}
                                width='300'
                                height='300'
                                className='canvas' />
                            </div>

                            <div className='scanBack' style={{display: 'none'}} ref={this.refContainerCanvasBack}>
                              <canvas
                                ref={this.refCanvasBack}
                                width='300'
                                height='300'
                                className='canvas' />
                            </div>
                          </div>
                          <div className='col-1' />
                        
                          <p
                            className='nameImage'
                            ref={this.nameFront}
                          > {this.props.nameFront}
                          </p>
                          <p 
                            className='nameImage'
                            ref={this.nameBack}
                          >
                            <span
                              id='btnDeleteID'
                              onClick={this.handleDeleteId}
                            >&times;</span> {this.props.nameBack}
                          </p>
                        </div>

                      </div>
                      <div className='col-1' />
                    </div>

                    <p className='titleInfo' id='titleAtt'>ATTACHMENTS</p>

                    <div className='row'>
                      <div className='col-1' />
                      <div className='col-10'>
                        {this.props.files.map((doc, i) => (
                          <p className='document' key={i}>
                            <i className='far fa-file' style={{marginRight: '10px'}} />{doc}
                          </p>
                        ))}
                      </div>
                      <div className='col-1' />
                    </div>

                    <div className="containerBtn row">
                      <div className="col-1" />
                      <div className="col-10">
                        <button
                          className='btnNext'
                          id='btnAttachments'
                          onClick={this.handleSubmit}
                        >SUBMIT</button>
                      </div>
                      <div className="col-1" />
                    </div>

                  </div>
                  <div className='col-1' />
                </div>

              </CreateStudent>
            ) : (
              <Redirect to='/createStudent/success' />
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
  console.log('registration', state.registration)
  return {
    email: state.email,
    nameFront: state.nameFront,
    nameBack: state.nameBack,
    imageFront: state.imageFront,
    imageBack: state.imageBack,
    photo: state.photo,
    infoMatched: state.infoMatched,
    files: state.files,
    registration: state.registration,
    login: state.login,
    token: state.token
  }
}

export default connect(mapStateToProps)(Review)
