import React, { Component, Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import '@/styles/manageUsers.styl'

class ManageUsers extends Component {
  state = {
    users: [
      {name: 'Juana', email: 'juana@use.com', password: '123'},
      {name: 'Juana', email: 'juana@use.com', password: '123'},
      {name: 'Juana', email: 'juana@use.com', password: '123'},
      {name: 'Juana', email: 'juana@use.com', password: '123'},
      {name: 'Juana', email: 'juana@use.com', password: '123'},
    ]
  }
  render () {
    return (
      <Fragment>
        {this.props.loginAdmin ? (
          <Fragment>
            <div className="row">
              <div className="col-8 offset-2 containerListUsers" style={{borderRadius: '2px'}}>
      
                <button 
                  className='btn btn-info document btnAddUser'
                  data-toggle='modal'
                  data-target='#ModalBack'
                >
                  Add User
                </button>
        
                <ul className="containerList">
                  <li className='rowUser'>
                    <p className='titleUser'>NAME</p>
                    <p className='titleUser'>EMAIL</p>
                    <p className='titleUser'>.</p>
                  </li>
                  {this.state.users.map((user, i) => (
                    <li className='rowUser' key={i}>
                      <p className='itemUser'>{user.name}</p>
                      <p className='itemUser'>{user.email}</p>
                      <p className='itemUser'> <a href="#">Delete</a> </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Modal Back */}
            <div className='modal fade' id='ModalBack' tabIndex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>
              <div className='modal-dialog modal-dialog-centered' role='document'>
                <div className='modal-content'>
                  <div className='modal-header'>
                    <h5 className='modal-title' id='exampleModalLabel'>Add User</h5>
                    <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                      <span aria-hidden='true'>&times;</span>
                    </button>
                  </div>
                  <div className='modal-body'>
                    <form>
                      <div className="form-group">
                        <label htmlFor="InputName">NAME</label>
                        <input type="text" className="form-control"
                          id="InputName" aria-describedby="emailHelp"
                          placeholder="Enter name"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="InputEmail">EMAIL</label>
                        <input type="email" className="form-control"
                          id="InputEmail" placeholder="user@email.com"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="InputPassword">PASSWORD</label>
                        <input type="password" className="form-control"
                          id="InputPassword" placeholder='••••••••••'
                        />
                      </div>

                      <button 
                        type="button"
                        className="btn btnSumbit"
                        data-dismiss='modal'
                      >Submit</button>
                    </form>
                  </div>
      
                </div>
              </div>
            </div>
          </Fragment>
        ) : (
          <Redirect to="/admin" />
        )}
      </Fragment>
    )
  }
}

function mapStateToProps (state, props) {
  return {
    loginAdmin: state.loginAdmin
  }
}

export default connect(mapStateToProps)(ManageUsers)
