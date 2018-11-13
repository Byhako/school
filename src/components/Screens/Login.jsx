import React, { Component, Fragment } from 'react'
import actions from '@/actions'
import { connect } from 'react-redux'
import '@/styles/login.styl'

class Login extends Component {
  constructor(props) {
    super(props)
    this.refEmail = React.createRef()
    this.refPassword = React.createRef()
    this.email = ''
    this.password = ''
  }

  handleChangeEmail = (e) => {
    const value = e.target.value
    this.email = value
  }

  handleChangePassword = (e) => {
    const value = e.target.value
    this.password = value
  }

  handleLogin = () => {
    const location = this.props.location.pathname.split('/')[1]

    if (location === 'admin') {
      this.props.dispatch(actions.login(this.email, this.password, 'admin'))
    } else {
      this.props.dispatch(actions.login(this.email, this.password, 'user'))
    }

  }

  render () {
    const path = this.props.location.pathname.split('/')[1]
    return (
      <Fragment>
        <div className="container">
          {!this.props.login && path === ''  &&
            <div className="row">
              <div className="col-3" />
              <div className="col-6 containerLogin" style={{borderRadius: '2px'}}>
                <input
                  type='email'
                  className='col-10 offset-1 input'
                  placeholder='student@email.com'
                  onChange={this.handleChangeEmail}
                  ref={this.refEmail}
                />
                <input
                  className='col-10 offset-1 input'
                  onChange={this.handleChangePassword}
                  ref={this.refPassword}
                  type="password"
                  placeholder='••••••••••'
                />
                <div className='col-10 offset-1 btnContainer pr-0'>
                  <button className="btnLogin btnNext" onClick={this.handleLogin}>LOGIN</button>
                </div>
              </div>
              <div className="col-3" />
            </div>
          }
          {!this.props.loginAdmin && path === 'admin' &&
            <div className="row">
              <div className="col-3" />
              <div className="col-6 containerLogin" style={{borderRadius: '2px'}}>
                <input
                  type='email'
                  className='col-10 offset-1 input'
                  placeholder='student@email.com'
                  onChange={this.handleChangeEmail}
                  ref={this.refEmail}
                />
                <input
                  className='col-10 offset-1 input'
                  onChange={this.handleChangePassword}
                  ref={this.refPassword}
                  type="password"
                  placeholder='••••••••••'
                />
                <div className='col-10 offset-1 btnContainer pr-0'>
                  <button className="btnLogin btnNext" onClick={this.handleLogin}>LOGIN</button>
                </div>
              </div>
              <div className="col-3" />
            </div>
          }
        </div>
      </Fragment>
    )
  }
}

function mapStateToProps (state, props) {
  return {
    login: state.login,
    loginAdmin: state.loginAdmin
  }
}

export default connect(mapStateToProps)(Login)
