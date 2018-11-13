import React, { Component, Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import actions from '@/actions'
import '@/styles/email.styl'

import CreateStudent from '../CreateStudent'

class Email extends Component {
  constructor (props) {
    super(props)
    this.refInputEmail = React.createRef()
    this.refError = React.createRef()
    this.email = ''
    this.state = {
      next: false,
      submit: false,
    }
  }

  componentDidMount () {
    this.props.dispatch({ type: 'SET_LOCATION', location: this.props.location.pathname })
  }

  componentDidUpdate (prevProps) {
    if (this.props.registration !== prevProps.registration) {
      this.props.dispatch({ type: 'SET_DISABLE_TAG', name:'email' })
      this.setState({next: true})
    }
  }

  handleNext = () => {
    const email = this.email
    const elError = this.refError.current
    const elInput = this.refInputEmail.current
    
    const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    const isValid = emailRegex.test(email)

    if (email && isValid) {
      elInput.classList.remove('errorEmail')
      elError.style.display = 'none'

      this.setState({submit: true})
      this.props.dispatch({ type: 'SET_EMAIL', email: this.email })
      this.props.dispatch(actions.setEmail(this.email, this.props.token))
    } else {
      elError.style.display = 'flex'
      elInput.classList.add('errorEmail')

    }
  }

  handleChangeInput = (e) => {
    const value = e.target.value
    this.email = value
  }

  render () {
    return (
      <Fragment>
        {this.props.login ? (
          <Fragment>
            {!this.state.next ? (
              <CreateStudent>

                <div className="row">
                  <div className="col-1" />
                  <div className="col-10 containerEmail" style={{borderRadius: '2px'}}>
                    <p className='title'>Submit student email.</p>

                    <input
                      type='email'
                      className='col-8 offset-2 inputEmail'
                      id='email'
                      placeholder='student@email.com'
                      onChange={this.handleChangeInput}
                      ref={this.refInputEmail}
                    />

                    <div className="error" ref={this.refError}>Error</div>

                    <div className="col-8 offset-2 pr-0">
                      <button className='btnNext btnEmail' onClick={this.handleNext}>NEXT</button>
                    </div>
                    
                  </div>
                </div>

                {this.state.submit &&
                 <div className="loader">Loading...</div>
                }

              </CreateStudent>
            ) : (
              <Redirect to='/createStudent/student' />
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

export default connect(mapStateToProps)(Email)
