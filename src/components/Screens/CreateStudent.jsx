import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import '@/styles/createStudent.styl'

class CreateStudent extends Component {
  componentDidMount () {
    /* clear data matched */
    this.props.dispatch({ type: 'SET_DATEMATCHED', dateMatched: {} })
  }

  render () {
    return (
      <Fragment>
        <nav className="container navCreateStudent">
          <div className="row">
            <div className="col-1 tem" />
            
            <div className="col-1 tem">
              <Link to='/createStudent/email'>
                <div
                  className={this.props.location === '/createStudent/email' ? 'is-active link' : 'link'}
                  id={this.props.email ? 'checkEmail' : 'noCheckEmail'}
                >
                  <i
                    className={this.props.email ? 'far fa-check-circle iconCheck iconShow' : 'far fa-check-circle iconCheck'}
                  />
                  EMAIL
                </div>
              </Link>
              <div className="point pActive" id="p1"/>
            </div>
            
            <div className="col-2 tem"></div>
            
            <div className="col-1 tem">
              {this.props.email ? (
                <Link to='/createStudent/student'>
                  <div
                    className={this.props.location === '/createStudent/student' ? 'is-active link' : 'link'}
                    id={this.props.student ? 'checkStutent' : 'noCheckStudent'}
                  >
                    <i
                      className={this.props.student ? 'far fa-check-circle iconCheck iconShow' : 'far fa-check-circle iconCheck'}
                    />
                    STUDENT<span>_</span>ID
                  </div>
                </Link>
                ) : (
                  <div className='link linkStudent'>STUDENT</div>
                )
              }
              <div id="p2"
                className={this.props.location === '/createStudent/email' ? 'point' : 'point pActive'}
              />
            </div>
            
            <div className="col-2 tem"></div>
            
            <div className="col-1 tem">
              {this.props.student ? (
                <Link to='/createStudent/photo'>
                  <div
                    className={this.props.location === '/createStudent/photo' ? 'is-active link' : 'link'}
                    id={this.props.photo ? 'checkPhoto' : 'noCheckPhoto'}
                  >
                    <i
                      className={this.props.photo ? 'far fa-check-circle iconCheck iconShow' : 'far fa-check-circle iconCheck'}
                    />
                    PHOTO
                  </div>
                </Link>
                ) : (
                <div className='link linkPhoto'>PHOTO</div>
                )
              }
              <div id="p3"
                className={this.props.location === '/createStudent/email' ||
                  this.props.location === '/createStudent/student' ? 'point' : 'point pActive'}
              />
            </div>
            
            <div className="col-2 tem"></div>
            
            <div className="col-1 tem">
              {this.props.photo ? (
                <Link to='/createStudent/attachments'>
                  <div 
                    className={this.props.location === '/createStudent/attachments' ? 'is-active link' : 'link'}
                    id={this.props.attachments ? 'checkAttachments' : 'noCheckAttachments'}
                  >
                    <i
                      className={this.props.attachments ? 'far fa-check-circle iconCheck iconShow' : 'far fa-check-circle iconCheck'}
                    />
                    ATTACHMENTS
                  </div>
                </Link>
                ) : (
                <div className='link linkAttachments'>ATTACHMENTS</div>
                )
              }
              <div id="p4"
                className={this.props.location === '/createStudent/email' ||
                  this.props.location === '/createStudent/student' ||
                  this.props.location === '/createStudent/photo' ? 'point' : 'point pActive'}
              />
            </div>
            
            <div className="col-1 tem" />

          </div>

          {/* LINES */}
          <div
            className={this.props.location === '/createStudent/email' ? 'line line1' : 'line line1 lineActive'}
          />
          <div
            className={this.props.location === '/createStudent/student' ||
              this.props.location === '/createStudent/email' ? 'line line2' : 'line line2 lineActive'}
          />
          <div
            className={this.props.location === '/createStudent/email' ||
              this.props.location === '/createStudent/student' ||
              this.props.location === '/createStudent/photo' ? 'line line3' : 'line line3 lineActive'}
          />
        </nav>

        <section className="container">
          {this.props.children}
        </section>

      </Fragment>
    )
  }
}

function mapStateToProps (state, props) {
  return {
    email: state.navCreateStudent.email,
    student: state.navCreateStudent.student,
    photo: state.navCreateStudent.photo,
    attachments: state.navCreateStudent.attachments,
    location: state.navCreateStudent.location
  }
}

export default connect(mapStateToProps)(CreateStudent)
