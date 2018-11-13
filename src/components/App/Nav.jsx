import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import '@/styles/nav.styl'

class Home extends Component {

  handleChangeLogin = () => {
    this.props.dispatch({ type: 'SET_TAB', tab: '/' })
  }

  handleChangeCreate = () => {
    this.props.dispatch({ type: 'SET_TAB', tab: '/createStudent/email' })
    this.props.dispatch({ type: 'CLEAR_STORE' })
  }

  handleChangeSearch = () => {
    this.props.dispatch({ type: 'SET_TAB', tab: '/searchStudent/photo' })
  }

  handleChangeLogout = () => {
    this.props.dispatch({ type: "CLEAR_STORE" })
    this.props.dispatch({ type: 'SET_LOGIN', state: {login: false, type: 'user'} })
    this.props.dispatch({ type: 'SET_TOKEN', token: '' })
  }

  handleLogoutAdmin = () => {
    this.props.dispatch({ type: "CLEAR_STORE" })
    this.props.dispatch({ type: 'SET_LOGIN', state: {login: false, type:'admin'} })
    this.props.dispatch({ type: 'SET_TAB', tab: '/admin' })
    this.props.dispatch({ type: 'SET_TOKEN', token: '' })
  }

  handleChangeUsers = () => {
    this.props.dispatch({ type: 'SET_TAB', tab: '/admin/manageUsers' })
  }

  handleChangeStudent = () => {
    this.props.dispatch({ type: 'SET_TAB', tab: '/admin/manageStudents' })
  }

  render () {
    const myPath = window.location.pathname.split('/')
    return (
      <div className="container-fluid myNav">
        {myPath[1] === 'admin' ? (
          <nav className="container">
            <div className="row">
              {this.props.loginAdmin ? (
                <Fragment>
                  <div className="col-1 elNav">
                    <Link to='/admin' onClick={this.handleLogoutAdmin} name='logout'>
                      <div
                        className={myPath.length === 2 ? 'itemNav is-selected' : 'itemNav' } 
                      >LOGOUT</div>
                    </Link>
                  </div>
                  <div className="col-2 elNav">
                    <Link to='/admin/manageUsers' onClick={this.handleChangeUsers} name='users'>
                      <div 
                        className={window.location.pathname === '/admin/manageUsers' ? 'itemNav is-selected' : 'itemNav' } 
                      >MANAGE USERS</div>
                    </Link>
                  </div>
                  <div className="col-2 elNav">
                    <Link to='/admin/manageStudents' onClick={this.handleChangeStudent} name='users'>
                      <div 
                        className={window.location.pathname === '/admin/manageStudents' ? 'itemNav is-selected' : 'itemNav' } 
                      >MANAGE STUDENTS</div>
                    </Link>
                  </div>
                </Fragment>
              ) : (
                <Fragment>
                  <div className="col-1 elNav">
                    <Link to='/admin' name='login'>
                      <div
                        className='itemNav is-selected' 
                      >LOGIN</div>
                    </Link>
                  </div>
                  <div className="col-4 elNav" />
                </Fragment>
              )}

              <div className="col-5 elNav" />
              <div className="col-2 elNav">
                <Link to='/admin'> <p id='name'>My School</p> </Link>
              </div>
            </div>
          </nav>
        ) : (
          <nav className="container">
            <div className="row">
              <div className="col-1 elNav">
                {this.props.login ? (
                  <Link to='/' onClick={this.handleChangeLogout} name='logout'>
                    <div
                      className={this.props.tab === '/' || this.props.tab === '/admin'? 'itemNav is-selected' : 'itemNav' } 
                    >LOGOUT</div>
                  </Link>
                ) : (
                  <Link to='/' onClick={this.handleChangeLogin} name='login'>
                    <div
                      className={this.props.tab === '/' ? 'itemNav is-selected' : 'itemNav' } 
                    >LOGIN</div>
                  </Link>
                )}
              </div>
              <div className="col-2 elNav">
                {this.props.login &&
                  <Link to='/createStudent/email' onClick={this.handleChangeCreate} name='create'>
                    <div 
                      className={this.props.tab === '/createStudent/email' ? 'itemNav is-selected' : 'itemNav' } 
                    >CREATE STUDENT</div>
                  </Link>
                }
              </div>
              <div className="col-2 elNav">
                <Link to='/searchStudent/photo' onClick={this.handleChangeSearch} name='search'>
                  <div 
                    className={this.props.tab === '/searchStudent/photo' ? 'itemNav is-selected' : 'itemNav' } 
                  >SEARCH STUDENT</div>
                </Link>
              </div>
              <div className="col-5 elNav" />
              <div className="col-2 elNav">
                <Link to='/'> <p id='name'>My School</p> </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    )
  }
}

function mapStateToProps (state, props) {
  return {
    loginAdmin: state.loginAdmin,
    login: state.login,
    tab: state.tab
  }
}

export default connect(mapStateToProps)(Home)
