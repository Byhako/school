import React, { Component, Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import SearchStudent from '../SearchStudent'
import actions from '@/actions'

import '@/styles/opt.styl'

class Otp extends Component {
  constructor (props) {
    super(props)
    this.refInputCode = React.createRef()
    this.code = ''

    this.state = {
      next: false
    }
  }

  componentDidUpdate () {
    if (this.props.verifiedCode) {
      this.props.dispatch({ type: 'SET_VERIFIEDCODE', verifiedCode: false })
      this.props.dispatch(actions.getProfile(this.props.idStudentSearch))
    }

    if (Object.keys(this.props.profile).length !== 0) {
      this.setState({next: true})
    }
  }

  handleChangeInput = (e) => {
    const value = e.target.value
    this.code = value
  }

  handleSubmit = () => {
    this.props.dispatch(actions.setCode(this.code, this.props.idStudentSearch))
  }

  render () {
    return (
      <Fragment>
        {!this.state.next ? (
          <SearchStudent>

            <div className='row'>
              <div className='col-1' />
              <div className='col-10 containerInfo'>
                <p className='titleOpt'>OTP</p>

                <input
                  type='text'
                  className='inputCode'
                  placeholder='Enter Code'
                  onChange={this.handleChangeInput}
                  ref={this.refInputCode}
                />

                <button
                  className='btnNext sumbitOtp'
                  onClick={this.handleSubmit}
                >SUBMIT</button>


              </div>
              <div className='col-1' />
            </div>

          </SearchStudent>
        ) : (
          <Redirect to='/searchStudent/info' />
        )}
      </Fragment>
    )
  }
}

function mapStateToProps (state, props) {
  return {
    idStudentSearch: state.idStudentSearch,
    verifiedCode: state.verifiedCode,
    profile: state.profile
  }
}

export default connect(mapStateToProps)(Otp)
