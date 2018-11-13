import React, { Component, Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import '@/styles/success.styl'
import actions from '@/actions'
import CreateStudent from '../CreateStudent'

class Success extends Component {
  componentDidMount () {
    this.props.dispatch({ type: 'SET_LOCATION', location: this.props.location.pathname })
    this.props.dispatch(actions.resetStore())
    this.props.dispatch({ type: 'SET_DISABLE_TAG', name: 'email' })
    this.props.dispatch({ type: 'SET_DISABLE_TAG', name: 'student' })
    this.props.dispatch({ type: 'SET_DISABLE_TAG', name: 'photo' })
    this.props.dispatch({ type: 'SET_DISABLE_TAG', name: 'attachments' })

  }

  render () {
    return (
      <Fragment>
        {this.props.login ? (
          <CreateStudent>
            <div className='row'>
              <div className='col-1' />
              <div className='col-10 containerInfo' style={{borderRadius: '2px'}}>
                <p className='messageSucces ml-2' >You have succesfully created a new student!</p>
                <i className="far fa-check-circle check" />
              </div>
              <div className='col-1' />
            </div>
          </CreateStudent>
        ) : (
          <Redirect to="/" />
        )}
      </Fragment>
    )
  }
}

function mapStateToProps (state, props) {
  return {
    login: state.login
  }
}

export default connect(mapStateToProps)(Success)
