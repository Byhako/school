import React, { Component, Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import actions from '@/actions' 
import '@/styles/student.styl'

import CreateStudent from '../CreateStudent'
import IdInput from './IdInput'

class Student extends Component {
  constructor (props) {
    super(props)
    this.refTab1 = React.createRef()
    this.refTab2 = React.createRef()
    
    this.refStudentInfo = React.createRef()
    this.refLabelForm = React.createRef()
    this.refButtonNext = React.createRef()

    this.options = ['First name', 'Second name', 'Surname', 'Brith date', 'Sex', 'Nationality', 'Number', 'Date of issue', 'Date of expiration']
    this.nameToSend = ['name', 'second_name', 'lastname', 'birth_date', 'sex', 'nationality',  'number', 'ID_issue_date', 'ID_exp_date']
    this.state = {
      tabActive: 'tab1',
      submit: false,
      matched: {}
    }
  }

  componentDidMount () {
    this.props.dispatch({ type: 'SET_DISABLE_TAG', name: 'email' })
    this.props.dispatch({ type: 'SET_LOCATION', location: this.props.location.pathname })
    if (this.props.login) {
      this.handleChangeTab1()
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.submit) return
    
   /* activar student info */  
    const {IdFrontDetection, IdBackDetection} = this.props
    const btnNext = this.refButtonNext.current

    if (IdFrontDetection.length !== 0 || IdBackDetection.length !== 0) {
      btnNext.style.visibility = 'visible'
      this.refStudentInfo.current.classList.add('activate')
      this.refLabelForm.current.classList.add('labelActivate')    
    } else {
      btnNext.style.visibility = 'hidden'
      this.refStudentInfo.current.classList.remove('activate')
      this.refLabelForm.current.classList.remove('labelActivate')    
    }

   /* updating data matched */
    if (this.props.infoMatched !== prevProps.infoMatched) {

      let matched = {}
      const infoMatched = this.props.infoMatched
      Object.keys(infoMatched).forEach((key) => {
        const value = infoMatched[key]
        if (value !== 'Delete') {
          matched[value] = key
        }
      })
      this.setState({matched})
      
    }
  }

  handleNext = () => {
    const studentId = this.props.registration.student_id
    const matched = this.state.matched

    let dataMatched = {}
    Object.keys(matched).forEach((key) => {
      const idx = this.options.indexOf(key)
      dataMatched[this.nameToSend[idx]] = matched[key]      
    })

    this.props.dispatch(actions.sendDataMatched(dataMatched, studentId, this.props.token))
    this.props.dispatch({ type: 'SET_DISABLE_TAG', name: 'student' })
    this.setState({submit: true})
  }

  handleChangeTab1 = () => {
    const tab1 = this.refTab1.current
    const tab2 = this.refTab2.current

    this.setState({tabActive: 'tab1'})
    this.props.dispatch({ type: 'SET_TABACTIVE', tabActive: 'tab1' })
    tab1.classList.add('tabActive')
    tab2.classList.remove('tabActive')
  }

  handleChangeTab2 = () => {
    const tab1 = this.refTab1.current
    const tab2 = this.refTab2.current
    
    this.setState({tabActive: 'tab2'})
    this.props.dispatch({ type: 'SET_TABACTIVE', tabActive: 'tab2' })
    tab1.classList.remove('tabActive')
    tab2.classList.add('tabActive')
  }

  render () {
    return (
      <Fragment>
        {this.props.login ? (
          <Fragment>
            {!this.state.submit ? (
              <CreateStudent>

                  <div className='row'>
                    <div className='col-1' />
                    <div className='col-10 containerScanStudent' style={{borderRadius: '2px'}}>
                      <p className='title'>Upload student ID image.</p>

                      <div className='containerTabs'>
                        <div
                          className='tab1 tabActive'
                          id='tab1'
                          onClick={this.handleChangeTab1}
                          ref={this.refTab1}
                        >FRONT</div>
                        <div
                          className='tab2'
                          id='tab2'
                          onClick={this.handleChangeTab2}
                          ref={this.refTab2}
                        >BACK</div>
                      </div>

                      <IdInput tabActive={this.state.tabActive} />

                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-1' />
                    <div className='col-10 containerInfoStudent' style={{borderRadius: '2px'}}>
                      <p
                        className='labelForm'
                        ref={this.refLabelForm}
                      >This form will autofill after the match</p>
                      
                      <p
                        className='title-form disabled'
                        ref={this.refStudentInfo}
                      >STUDENT INFO</p>

                      <form className='form-student disabled'>
                        <ul className='list deactivate'>
                          {this.options.map((item, i) => {

                            const value = this.state.matched[item]
                            let labelStyle = { color: '#4E5B8C' }
                            let inputStyle = {}
                            if (i%2 === 0) {
                              inputStyle.left = 0
                            } else {
                              inputStyle.right = 0
                              labelStyle.marginLeft = '3%'
                            }
                            if (value) labelStyle.color = 'white'

                            return (
                              <li className='element-info' key={i}>
                                <label
                                  style={labelStyle}
                                  className='lb-student'
                                  htmlFor={item}
                                  >{item}
                                </label>
                                {value ? (
                                    <p className='info-match disabled' style={inputStyle}>{value}</p>
                                  ) : (
                                    <input
                                      type='text'
                                      className='ipt-student disabled'
                                      id={item}
                                      disabled
                                      style={inputStyle}
                                    />
                                  )}
                              </li>
                            )
                          })}
                        </ul>
                      </form>
                  
                      <button
                        className='btnNext'
                        id='btnStudentInfo'
                        onClick={this.handleNext}
                        ref={this.refButtonNext}
                      >NEXT</button>
                    </div>
                    <div className='col-1' />
                  </div>
                
              </CreateStudent>
            ) : (
              <Redirect to='/createStudent/photo' />
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
    infoMatched: state.infoMatched,
    IdFrontDetection: state.IdFrontDetection, 
    IdBackDetection: state.IdBackDetection,
    login: state.login,
    token: state.token
  }
}

export default connect(mapStateToProps)(Student)
