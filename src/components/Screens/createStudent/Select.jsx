import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import '@/styles/select.styl'

let ban = 0

class Select extends Component {
  constructor (props) {
    super(props)
    this.refFirst = React.createRef()
    this.listOptions = React.createRef()
    this.refIcon = React.createRef()

    this.options = [
      'Delete',
      'First name',
      'Second name',
      'Surname',
      'Brith date',
      'Sex',
      'Nationality',
      'Number',
      'Date of issue',
      'Date of expiration'
    ]

    this.state = {
      value: 'Match a field'
    }
  }

  openSelect = () => {
    const elFirst = this.refFirst.current
    const elList = this.listOptions.current

    if (ban === 0) {
      elFirst.style.backgroundColor = '#49C379'
      elFirst.style.borderRight = '1px solid #49C379'
      elList.style.display = 'block'
      ban = 1  
    } else {
      elFirst.style.backgroundColor = '#1F2944'
      elFirst.style.borderRight = '1px solid #1F2944'
      elList.style.display = 'none'
      ban = 0  
    }
  }

  closeSelect = () => {
    const elIcon = this.refIcon.current
    const elFirst = this.refFirst.current
    const elList = this.listOptions.current

    elFirst.style.backgroundColor = '#1F2944'
    elFirst.style.borderRight = '1px solid #1F2944'
    elList.style.display = 'none'
  }

  handleSelect = (e) => {
    const value = e.target.innerText
    const elIcon = this.refIcon.current
    const elFirst = this.refFirst.current
    const elList = this.listOptions.current

console.log({item: this.props.item, value: value})
    this.props.dispatch({
      type: 'SET_DATEMATCHED',
      dateMatched: {item: this.props.item, value: value}
    })

    elFirst.style.backgroundColor = '#1F2944'
    elFirst.style.borderRight = '1px solid #1F2944'
    elList.style.display = 'none'
    
    if (value !== 'Delete') {
      elIcon.style.display = 'none'
      this.setState({value})      
    }
  }


  render () {
    const value = this.props.value

    return (
      <Fragment>
        {value === 'select' ? (
          <Fragment>
            <div 
              className='first'
              onClick={this.openSelect}
              ref={this.refFirst}
              >
              <i className='fas fa-angle-down' ref={this.refIcon}/>
              <p className='labelFirst'>{this.state.value}</p>
            </div>

            <div className='containerSelect' onMouseLeave={this.closeSelect}>
              <div className='listOptions' ref={this.listOptions}>
                {this.options.map((item, idx) => (
                    <p
                      key={idx}
                      className="option"
                      onClick={this.handleSelect}
                    >{item}</p>
                  )
                )}
              </div>
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <div 
              className='first'
              onClick={this.openSelect}
              ref={this.refFirst}
              >
              <p className='labelFirst'>{value}</p>
            </div>

            <div className='containerSelect' onMouseLeave={this.closeSelect}>
              <div className='listOptions' ref={this.listOptions}>
                {this.options.map((item, idx) => (
                    <p
                      key={idx}
                      className="option"
                      onClick={this.handleSelect}
                    >{item}</p>
                  )
                )}
              </div>
            </div>
          </Fragment>
        )}
      </Fragment>
    )
  }
}

export default connect()(Select)
