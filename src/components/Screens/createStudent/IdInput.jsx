import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
// import Select from './Select'
import Select from 'react-select'

import actions from '@/actions'
import '@/styles/student.styl'

class IdInput extends Component {
  constructor (props) {
    super(props)
    this.refContainerScan = React.createRef()
    this.refInput = React.createRef()
    
    this.refContainerCanvas = React.createRef()
    this.refCanvas = React.createRef()

    this.refName = React.createRef()
    this.refProcessing = React.createRef()
    this.refUploading = React.createRef()

    this.numberItem = 0 // para controlar z-index del select
    this.name = ''
    
    this.state = {
      dataForm: {}
    }
  }

  componentDidMount () {
    this.numberItem = 0
    this.props.dispatch({
      type: 'SET_DATEMATCHED',
      dateMatched: {}
    })
    this.changeInputCanvas()
    this.showData()
    
    this.showBoxes()
  }

  componentDidUpdate (prevProps, prevState) {
    this.numberItem = 0
    this.changeInputCanvas()
    this.showTags()

   /* show name image*/
    if (this.name) {
      this.refName.current.style.display = 'block'
    } else {
      this.refName.current.style.display = 'none'
    }

   /* show date match*/
    if(this.props.dateMatched !== prevProps.dateMatched) {
      this.showData()
    }

    if(this.props.tabActive !== prevProps.tabActive) {
      this.showData()
    }

    const lengthFront = this.props.IdFrontDetection.length
    const prevLengthFront = prevProps.IdFrontDetection.length

    const lengthBack = this.props.IdBackDetection.length
    const prevLengthBack = prevProps.IdBackDetection.length
    
    if (lengthFront !== prevLengthFront || lengthBack !== prevLengthBack) {
      this.showData()
    }

    if (this.props.IdFrontDetection && this.props.processingFront === 'end') {
      this.showBoxes()
    }

    // console.log('infoMatched:',this.props.infoMatched)

  }

  changeInputCanvas () {
    if (this.props.tabActive === 'tab1') {
      if (this.props.imageFront) {
        this.showImage(this.props.imageFront)
        this.name = this.props.nameFront
      } else {
        // clear input field
        this.refInput.current.value = ''
        this.refContainerCanvas.current.style.display = 'none'
        this.refContainerScan.current.style.display = 'block'
        this.name = ''
      }
    } else {
      if (this.props.imageBack) {
        this.showImage(this.props.imageBack)
        this.name = this.props.nameBack
      } else {
        // clear input field
        this.refInput.current.value = ''
        this.refContainerCanvas.current.style.display = 'none'
        this.refContainerScan.current.style.display = 'block'
        this.name = ''
      }
    }
  }

  showTags () {
    const elUploading = this.refUploading.current
    const elProcessing = this.refProcessing.current
    let processing = this.props.processingFront
    let image = this.props.imageFront

    if (this.props.tabActive === 'tab2') {
      processing = this.props.processingBack
      image = this.props.imageBack
    } 

    if (image && !processing) {
      elUploading.style.display = 'flex'
    } else if (image && processing === true) {
      elUploading.style.display = 'none'
      elProcessing.style.display = 'flex'
    } else if (processing === 'end') {
      elProcessing.style.display = 'none'
    }
  }

  showData () {
    let dataForm = {}

    let value
    const dateMatched = this.props.dateMatched
    let infoMatched = {...this.props.infoMatched}


    if (this.props.tabActive === 'tab1') {
      this.props.IdFrontDetection.forEach((element) => {
        if (element.Type === 'WORD') {
          dataForm[element.DetectedText] = 'select'
        }
      })
      // this.data1.forEach((element) => {
      //   dataForm[element] = 'select'
      // })
    } else {
      this.props.IdBackDetection.forEach((element) => {
        if (element.Type === 'WORD') {
          dataForm[element.DetectedText] = 'select'
        }
      })
      // this.data2.forEach((element) => {
      //   dataForm[element] = 'select'
      // })
    }

    if (dateMatched.item) {
      const idx = Object.values(infoMatched).indexOf(dateMatched.value)

      if (idx !== -1) {
        const key = Object.keys(infoMatched)[idx]
        if (dateMatched.value !== 'Delete') {
          delete infoMatched[key]
        }
        infoMatched[dateMatched.item] = dateMatched.value
      } else {
        infoMatched[dateMatched.item] = dateMatched.value
      
      }
    }

    Object.keys(dataForm).forEach((el) => {
      if (infoMatched[el]) {
        dataForm[el] = infoMatched[el]
      }
    })
    
    // console.log(dataForm)
    // this.props.dispatch({ type: 'SET_INFOMATCHED', infoMatched:{} })
    this.props.dispatch({ type: 'SET_INFOMATCHED', infoMatched })
    this.setState({dataForm})

    if (this.props.nameFront !== '') {
      const processingState = {tab: 'tab1', processing: 'end'}
      this.props.dispatch({ type: 'SET_PROCESSING', processingState })
    }
    if (this.props.nameBack !== '') {
      const processingState = {tab: 'tab2', processing: 'end'}
      this.props.dispatch({ type: 'SET_PROCESSING', processingState })
    }
  }

  showBoxes () {
    let canvas = this.refCanvas.current
    let ctx = canvas.getContext('2d')
    let data, orientation, width0, height0, x0, y0
    ctx.fillStyle="#FFFF002C"

    if (this.props.tabActive === 'tab1') {
      data = this.props.IdFrontDetection
      orientation = this.props.orientationFront
    } else {
      data = this.props.IdBackDetection
      orientation = this.props.orientationBack
    }

    if (orientation === 'vertical') {
      width0 = 240
      height0 = 340
      x0 = 50
      y0 = 0
    }
    if (orientation === 'horizontal') {
      width0 = 340
      height0 = 240
      x0 = 0
      y0 = 50
    }
    
    setTimeout(function(){
      data.forEach((element) => {
        if (element.Type === 'WORD') {
          const box = element.Geometry.BoundingBox
          //console.log(box)
          const Width = box.Width*width0
          const Height = box.Height*height0
          const Left = box.Left*width0 + x0
          const Top = box.Top*height0 + y0
          ctx.fillRect(Left, Top, Width, Height)
           // fillRect(x, y, width, height)
        }
      })
    }, 500)

  }

  handleInput = (e) => {
    const input = e.nativeEvent.srcElement
    const file = input.files[0]
    const name = file.name 
    const ext = name.split('.')[1]
    const data = {...this.props.registration, ext, type: 'id'}
    
    const reader = new FileReader()
    reader.readAsDataURL(input.files[0])

    reader.onload = (e) => {
      //e.target.result contents the base64 data from the image uploaded
      const image = e.target.result
      console.log(e.target)
      this.props.dispatch(actions.getUrl(data, file, this.props.token, this.props.tabActive))
      
      // save  and show image
      if (this.props.tabActive === 'tab1') {

        const dataImage = {side: 'front', image}
        this.props.dispatch({ type: 'SAVE_IMAGE', dataImage })
        this.props.dispatch({ type: 'SAVE_NAMEFRONT', nameFront: name  })

      } else {

        const dataImage = {side: 'back', image}
        this.props.dispatch({ type: 'SAVE_IMAGE', dataImage })
        this.props.dispatch({ type: 'SAVE_NAMEBACK', nameBack: name  })

      }      
      
      this.showImage(image)
    }
  }

  showImage = (file) => {
    this.refContainerCanvas.current.style.display = 'flex'
    this.refContainerScan.current.style.display = 'none'
    let canvas = this.refCanvas.current

    // I drawing picture in canvas
    let ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    let filePreview = document.createElement('img')
    filePreview.src = file
    filePreview.onload = () => {
      // vertical
      let width = 240
      let height = 340
      let x = 50
      let y = 0
      const height0 = filePreview.height
      const width0 = filePreview.width
      if (width0>height0) {
        // horizontal
        width = 340
        height = 240
        x = 0
        y = 50
        const orientation = {tab: this.props.tabActive, orientation: 'horizontal'}
        this.props.dispatch({ type: 'SET_ORIENTATION', orientation })
      } else {
        const orientation = {tab: this.props.tabActive, orientation: 'vertical'}
        this.props.dispatch({ type: 'SET_ORIENTATION', orientation })
      }
      ctx.drawImage(filePreview, x, y, width, height)
    }
  }

  handleDeleteId = () => {
    if (this.props.tabActive === 'tab1') {
      const dataImage = {side: 'front', image: false}
      this.refName.current.style.display = 'none'
      this.props.dispatch({ type: 'SAVE_IMAGE', dataImage })
      this.props.dispatch({ type: 'SAVE_NAMEFRONT', nameFront: ''  })
    } 
    else {
      const dataImage = {side: 'back', image: false}
      this.refName.current.style.display = 'none'
      this.props.dispatch({ type: 'SAVE_IMAGE', dataImage })
      this.props.dispatch({ type: 'SAVE_NAMEBACK', nameBack: ''  })
    }
    
    const tab = this.props.tabActive
    
    const detection = {tab, TextDetections: []}
    this.props.dispatch({ type: 'SAVE_DETECTION', detection })
    
    const orientation = {tab, orientation: ''}
    this.props.dispatch({ type: 'SET_ORIENTATION', orientation })

    const processingState = {tab, processing: false}
    this.props.dispatch({ type: 'SET_PROCESSING', processingState })
  }

  handleMatchField = (item) => (e) => {
    const value = e.label;
    this.props.dispatch({
      type: 'SET_DATEMATCHED',
      dateMatched: { item, value }
    })
  }

  render () {
    const options = [
      { label: 'Delete', value: '' },
      { label: 'First name', value: '' },
      { label: 'Second name', value: '' },
      { label: 'Surname', value: '' },
      { label: 'Birth date', value: '' },
      { label: 'Sex', value: '' },
      { label: 'Nationality', value: '' },
      { label: 'Number', value: '' },
      { label: 'Date of issue', value: '' },
      { label: 'Date of expiration', value: '' },
    ];

    const selectStyle = {
      control: (base, state) => {
        return {
          ...base,
          fontSize: 13,
          backgroundColor: state.isFocused ? '#49c379' : '#1A2133',
          border: 'none',
          height: 23,
          minHeight: 0,
          borderRadius: 0,  
        }
      },
      placeholder: (base) => ({
        ...base,
        color: 'white',
      }),
      indicatorSeparator: (base) => null,
      indicatorsContainer: (base) => ({
        ...base,
        padding: 0
      }),
      valueContainer: (base) => ({
        ...base,
        padding: '4px 6px',
      }),
      menu: (base) => ({
        ...base,
        margin: 0,
        fontSize: 13,
        borderRadius: 0,
      }),
      singleValue: (base) => {
        return {
          ...base,
          color: 'white',
        }
      },
      dropdownIndicator: (base) => {
        return {
          ...base,
          padding: '0px 4px',
          color: 'white'
        }
      },
      option: (base) => {
        // console.log(base)
        return {
          ...base,
          color: 'black',
          padding: '5px 8px'
        }
      }
    }

    return (
      <div className='row containerScan'>
        <div className='col-1' />
        <div className='col-10'>
          <input
            onChange={this.handleInput}
            ref={this.refInput}
            type='file'
            name='myFile'
            accept='image/*'
            id='ID-upload'
            style={{display: 'none'}}
          />
          <label htmlFor='ID-upload' className='scan' ref={this.refContainerScan}>
            <p className='labelUpload'>
              <i className='far fa-arrow-alt-circle-up' style={{fontSize: '30px'}} />
            </p>
            <p className='labelUpload'>
              Click to Upload ID image.
            </p>
          </label>

          <div className='containerCanvas' style={{display: 'none'}} ref={this.refContainerCanvas}>
            <canvas
              ref={this.refCanvas}
              width='340'
              height='340'
              className='canvas ready' 
            />

            <div className="tagUploading" ref={this.refUploading}>
              <div className="myloader">Loading...</div>
              <span style={{marginLeft: '7px'}}>Uploading</span>
            </div>
            <div className="tagProcessing" ref={this.refProcessing}>
              <div className="myloader">Loading...</div>
              <span style={{marginLeft: '7px'}}>Processing</span>
            </div>
          </div>

          <p className='nameImage' ref={this.refName}>
            <span
              id='btnDeleteID'
              onClick={this.handleDeleteId}
            >&times;</span> {this.name}
          </p>


          {Object.keys(this.state.dataForm).length !== 0 &&
            <div style={{marginTop: '40px'}}>
              <p className='titleMathc'>Match the fields to complete the form below</p>
              <form action='' className='form'>
                <ul className='listMatch'>
                  {Object.keys(this.state.dataForm).map((item, i) => {
                    if (this.state.dataForm[item] !== 'Delete') {
                      const numberItem = this.numberItem
                      const idx = 200 - numberItem
                      let myStyle = { zIndex: idx }

                      if (numberItem%2 === 0) {
                        myStyle.left = 0
                      } else {
                        myStyle.right = 0
                      }
                      this.numberItem += 1

                      return (
                        <li
                          className='elementMatch'
                          key={i}
                          style={myStyle}

                          >
                          <div className='containerItem' style={myStyle}>
                            <label className='labelMatch'>{item}</label>

                            <div className='customSelect'>
                              { 
                                <Select
                                placeholder='Match a field'
                                options={options}
                                styles={selectStyle}
                                blurInputOnSelect={true}
                                onChange={this.handleMatchField(item)}
                                />
                                
                              }
                              { /*
                                <Select item={item} value={this.state.dataForm[item]} />
                                */
                              }
                              
                              
                            </div>

                          </div>
                        </li>
                      )
                    }
                  })}
                </ul>
              </form>
            </div>
          }

        </div>
        <div className='col-1' />
      </div>
    )
  }
}

function mapStateToProps (state, props) {
  return {
    registration: state.registration,
    imageFront: state.imageFront,
    imageBack: state.imageBack,
    nameFront: state.nameFront,
    nameBack: state.nameBack,
    orientationFront: state.orientationFront,
    orientationBack: state.orientationBack,
    IdFrontDetection: state.IdFrontDetection, 
    IdBackDetection: state.IdBackDetection,
    processingFront: state.processingFront,
    processingBack: state.processingBack,
    dateMatched: state.dateMatched,
    infoMatched: state.infoMatched,
    token: state.token
  }
}


export default connect(mapStateToProps)(IdInput)
