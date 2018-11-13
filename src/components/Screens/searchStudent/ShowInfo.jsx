import React, { Component, Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import actions from '@/actions'
import { connect } from 'react-redux'
import '@/styles/showInfo.styl'

import SearchStudent from '../SearchStudent'

class ShowInfo extends Component {
  constructor (props) {
    super(props)
    const profile = this.props.profile
    console.log('PROFILE: ', profile)
    const urlPhoto = profile.FaceID[0].photo_url || null
    const urlFront = profile.ID[0].photo || null
    const urlBack = profile.ID[0].photo || null
    
    console.log(urlPhoto)
    console.log(urlFront)
    console.log(urlBack)

    this.email = profile.email
    this.files = profile.attachments
    this.nameFront = 'image 1'
    this.nameBack = 'image 2'
    this.options = ['Email', 'First name', 'Second name', 'Surname', 'Brith date', 'Sex', 'Nationality', 'Number', 'Date of issue', 'Date of expiration']
    this.nameToSend = ['email', 'name', 'second_name', 'lastname', 'birth_date', 'sex', 'nationality',  'number', 'ID_issue_date', 'ID_exp_date']

    let matched = {}
    Object.keys(profile).forEach((key) => {
      const value = profile[key]
      if (key !== 'CreatedAt' &&
        key !== 'FaceID' &&
        key !== 'ID' &&
        key !== 'OTP' &&
        key !== 'UpdatedAt' &&
        key !== 'status' &&
        key !== '__v' &&
        key !== '_id' &&
        key !== 'attachments') {
        const idx = this.nameToSend.indexOf(key)
        const newKey = this.options[idx]
        matched[newKey] = value
      }
    })
    
    if (urlPhoto) this.props.dispatch(actions.getImage('photo', urlPhoto))
    if (urlFront) this.props.dispatch(actions.getImage('front', urlFront))
    if (urlBack) this.props.dispatch(actions.getImage('back', urlBack))

    this.state = {
      next: false,
      matched
    }
  }

  componentDidMount () {
    this.props.dispatch({ type: 'SET_LOCATION', location: this.props.location.pathname })
  }

  render () {
    const imageFront = this.props.imageFront
    const imageBack = this.props.imageBack
    return (
      <Fragment>
        {!this.state.next ? (
          <SearchStudent>

            <div className='row'>
              <div className='col-1' />
              <div className='col-10 containerInfo'>
                <p className='titleInfo'>STUDENT INFO</p>

                <div className='row'>
                  <div className='col-1' />
                  <div className='col-10'>
                    <div className='row textEmail'>

                      <i className='far fa-user' style={{fontSize: '38px'}} />
                      <div>
                        <p style={{color: '#49C379'}}>Email</p>
                        <p>{this.email}</p>
                      </div>
                    </div>

                    <div className='row infoUser'>
                      <div className='col-3 imgUser'>
                        <img src={this.props.photo} alt='photo' className='imageID' />
                      </div>
                      <div className='col contentItem'>
                        {Object.keys(this.state.matched).map((item, i) => (
                          <div key={i} style={{width: '50%', 'marginBottom': '10px'}}>
                            <p style={{color: '#49C379'}}>{item}</p>
                            <p style={{color: 'white'}}>{this.state.matched[item]}</p>
                          </div>
                        ))}

                      </div>
                    </div>

                  </div>
                  <div className='col-1' />
                </div>

                <p className='titleInfo' id='id'>IDs</p>

                <div className='row'>
                  <div className='col-1' />
                  <div className='col-10'>
                    {imageFront &&
                      <Fragment>
                        <p className='titleInfo' style={{width: '48px'}}>FRONT</p>
                        <p className='document' data-toggle='modal' data-target='#ModalFront'>
                          <i className='far fa-file-image' style={{marginRight: '10px'}} />
                          {this.nameFront}
                        </p>
                      </Fragment>
                    }
                    {imageBack &&
                      <Fragment>
                        <p className='titleInfo' style={{width: '48px'}}>BACK</p>
                        <p className='document' data-toggle='modal' data-target='#ModalBack'>
                          <i className='far fa-file-image' style={{marginRight: '10px'}} />
                          {this.nameBack}
                        </p>
                      </Fragment>
                    }

                  </div>
                  <div className='col-1' />
                </div>

                <p className='titleInfo' id='titleAtt'>ATTACHMENTS</p>

                <div className='row'>
                  <div className='col-1' />
                  <div className='col-10'>
                    {this.files.map((doc, i) => (
                      <p className='document' key={i}>
                        <i className='far fa-file' style={{marginRight: '10px'}} />{doc.filename}
                      </p>
                    ))}
                  </div>
                  <div className='col-1' />
                </div>

              </div>
              <div className='col-1' />
            </div>

          </SearchStudent>
        ) : (
          <Redirect to='/' />
        )}

        {/* Modal Front */}
        <div className='modal fade' id='ModalFront' tabIndex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>
          <div className='modal-dialog modal-dialog-centered' role='document'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title' id='exampleModalLabel'>{this.props.nameFront}</h5>
                <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                  <span aria-hidden='true'>&times;</span>
                </button>
              </div>
              <div className='modal-body'>
                <img src={imageFront ? imageFront : undefined} alt='id' className='imageModal' />
              </div>
              <div className='modal-footer'>
                <button type='button' className='btn btn-Modal' data-dismiss='modal'>Close</button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Back */}
        <div className='modal fade' id='ModalBack' tabIndex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>
          <div className='modal-dialog modal-dialog-centered' role='document'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title' id='exampleModalLabel'>{this.props.nameBack}</h5>
                <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                  <span aria-hidden='true'>&times;</span>
                </button>
              </div>
              <div className='modal-body'>
                <img src={imageBack ? imageBack : undefined} alt='id' className='imageModal' />
              </div>
              <div className='modal-footer'>
                <button type='button' className='btn btn-Modal' data-dismiss='modal'>Close</button>
              </div>
            </div>
          </div>
        </div>

      </Fragment>
    )
  }
}

function mapStateToProps (state, props) {
  return {
    imageFront: state.imageFront,
    imageBack: state.imageBack,
    photo: state.photo,
    profile: state.profile
  }
}

export default connect(mapStateToProps)(ShowInfo)
