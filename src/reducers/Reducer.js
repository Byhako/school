import person from '@/images/person.png'
import { initialState } from '@/config/store'

export default Reducer

function Reducer (state, action) {
  const reducer = ({
    SET_LOGIN,
    SET_TOKEN,
    SET_DISABLE_TAG,
    SET_LOCATION,
    SET_REGISTRATION,
    SAVE_IMAGE,
    SET_TAB,
    SET_DATEMATCHED,
    SAVE_NAMEBACK,
    SAVE_NAMEFRONT,
    SET_INFOMATCHED,
    SET_EMAIL,
    SAVE_PHOTOSEARCH,
    SET_FILES,
    SET_TABACTIVE,
    SAVE_DETECTION,
    SET_PROCESSING,
    SET_ORIENTATION,
    SET_PHOTOMACHED,
    SET_PHOTOSEARCHMATCH,
    SET_IDSTUDENT,
    SET_VERIFIEDCODE,
    SET_PROFILE,
    SET_STUDENTS,
    SET_ERRORSEARCH,
    SET_STUDENFOUND,
    CLEAR_STORE
  })[action.type]

  return (reducer && reducer(state, action)) || state
}

function SET_LOGIN (state, action) {
  if (action.state.type === 'admin') {
    return { ...state, loginAdmin: action.state.login }
  } else {
    return { ...state, login: action.state.login }
  }
}

function SET_DISABLE_TAG (state, action) {
  let navCreateStudent = state.navCreateStudent
  switch (action.name) {
    case 'email':
      navCreateStudent.email = true
      break
    case 'student':
      navCreateStudent.email = true
      navCreateStudent.student = true
      break
    case 'photo':
      navCreateStudent.email = true
      navCreateStudent.student = true
      navCreateStudent.photo = true
      break
    default:
      navCreateStudent.email = true
      navCreateStudent.student = true
      navCreateStudent.photo = true
      navCreateStudent.attachments = true
  }
  return { ...state, navCreateStudent }
}

function SET_LOCATION (state, action) {
  let navCreateStudent = state.navCreateStudent
  navCreateStudent['location'] = action.location
  return { ...state, navCreateStudent }
}

function SET_TAB (state, action) {
  return { ...state, tab: action.tab }
}

function SET_VERIFIEDCODE (state, action) {
  return { ...state, verifiedCode: action.verifiedCode }
}

function SET_TOKEN (state, action) {
  return { ...state, token: action.token }
}

function SET_IDSTUDENT (state, action) {
  return { ...state, idStudentSearch: action.idStudentSearch }
}

function SET_EMAIL (state, action) {
  return { ...state, email: action.email }
}

function SET_PHOTOSEARCHMATCH (state, action) {
  return { ...state, photoSearchMatch: action.photoSearchMatch }
}

function SET_REGISTRATION (state, action) {
  const registration = { student_id: action.id }
  return { ...state, registration }
}

function SAVE_IMAGE (state, action) {
  if (action.dataImage.side === 'front') {

    const imageFront = action.dataImage.image
    return { ...state, imageFront }

  } else if (action.dataImage.side === 'back') {

    const imageBack = action.dataImage.image
    return { ...state, imageBack }

  } else {
    const photo = action.dataImage.image
    return { ...state, photo }
  }
}

function SET_DATEMATCHED (state, action) {
  return { ...state, dateMatched: action.dateMatched }
}

function SET_INFOMATCHED (state, action) {
  return { ...state, infoMatched: action.infoMatched }
}

function SAVE_NAMEFRONT (state, action) {
  return { ...state, nameFront: action.nameFront }
}

function SAVE_NAMEBACK (state, action) {
  return { ...state, nameBack: action.nameBack }
}

function SAVE_PHOTOSEARCH (state, action) {
  const photoSearch = action.dataImage
  return { ...state, photoSearch }
}

function SET_FILES (state, action) {
  return { ...state, files: action.files }
}

function SET_TABACTIVE (state, action) {
  return { ...state, tabActive: action.tabActive }
}

function SET_PHOTOMACHED (state, action) {
  return { ...state, photoMached: action.photoMached }
}

function SAVE_DETECTION (state, action) {
  if (action.detection.tab === 'tab1') {
    return { ...state, IdFrontDetection: action.detection.TextDetections }
  } else {
    return { ...state, IdBackDetection: action.detection.TextDetections }
  }
}

function SET_PROCESSING (state, action) {
  if (action.processingState.tab === 'tab1') {
    return { ...state, processingFront: action.processingState.processing }
  } else {
    return { ...state, processingBack: action.processingState.processing }
  }
}

function SET_ORIENTATION (state, action) {
  if (action.orientation.tab === 'tab1') {
    return { ...state, orientationFront: action.orientation.orientation }
  } else {
    return { ...state, orientationBack: action.orientation.orientation }
  }
}

function SET_PROFILE (state, action) {
  return { ...state, profile: action.profile }
}

function SET_STUDENTS (state, action) {
  return { ...state, students: action.students }
}

function SET_ERRORSEARCH (state, action) {
  return { ...state, errorSearch: action.error }
}

function SET_STUDENFOUND (state, action) {
  return { ...state, studenFound: action.studenFound }
}

function CLEAR_STORE (state, action) {
  return { ...state,
    navCreateStudent: {
      email: false,
      student: false,
      photo: false,
      attachments: false,
      location: '/'
    },
    // login: false,
    tab: '/',
    tabActive: 'tab1',
    registration: null,
    email: null,
    imageFront: false,
    imageBack: false,
    nameFront: '',
    nameBack: '',
    orientationFront: '',
    orientationBack: '',
    IdFrontDetection: [],
    IdBackDetection: [],
    processingFront: false,
    processingBack: false,
    photo: person,
    photoMached: 'none',
    photoSearch: person,
    photoSearchMatch: false,
    dateMatched: {},
    infoMatched: {},
    files: [],
    idStudentSearch: '',
    verifiedCode: false,
    profile: {},
    students: [],
    errorSearch: false,
    studenFound: {}
  }
}
