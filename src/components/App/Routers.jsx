import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import socket from '@/socketio'

import Nav from '@/components/App/Nav'
import Login from '@/components/Screens/Login'
import Email from '@/components/Screens/createStudent/Email'
import Student from '@/components/Screens/createStudent/Student'
import Photo from '@/components/Screens/createStudent/Photo'
import Attachments from '@/components/Screens/createStudent/Attachments'
import Review from '@/components/Screens/createStudent/Review'
import Success from '@/components/Screens/createStudent/Success'
import PhotoSearch from '@/components/Screens/searchStudent/Photo'
import Otp from '@/components/Screens/searchStudent/Otp'
import ShowInfo from '@/components/Screens/searchStudent/ShowInfo'
import ManageUsers from '@/components/Screens/admin/ManageUsers'
import ManageStudents from '@/components/Screens/admin/ManageStudents'

const VERSION = 'v0.1.1'
const VERSION_TAG = _ => true && console.log(VERSION)

class AppRouter extends Component {
  componentDidMount () {
    const { student_id } = this.props.registration
    student_id && socket.connect(student_id)

    VERSION_TAG()
  }

  render () {
    return (
      <BrowserRouter>
        <Fragment>
          <Nav />
          <Switch>
            <Route exact path='/' component={Login} />
            <Route exact path='/createStudent/email' component={Email} />
            <Route exact path='/createStudent/student' component={Student} />
            <Route exact path='/createStudent/photo' component={Photo} />
            <Route exact path='/createStudent/attachments' component={Attachments} />
            <Route exact path='/createStudent/review' component={Review} />
            <Route exact path='/createStudent/success' component={Success} />
            <Route exact path='/searchStudent/photo' component={PhotoSearch} />
            <Route exact path='/searchStudent/otp' component={Otp} />
            <Route exact path='/searchStudent/info' component={ShowInfo} />
            <Route exact path='/admin' component={Login} />
            <Route exact path='/admin/manageUsers' component={ManageUsers} />
            <Route exact path='/admin/manageStudents' component={ManageStudents} />
          </Switch>
        </Fragment>
      </BrowserRouter>
    )
  }
}

function mapStateToProps (state, props) {
  return {
    registration: state.registration || {}
  }
}

export default connect(mapStateToProps)(AppRouter)
