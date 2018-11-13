import {applyMiddleware, createStore} from 'redux'
import {createLogger} from 'redux-logger'
import ReduxThunk from 'redux-thunk'
import Reducer from '../reducers/Reducer'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
import person from '@/images/person.png'

import { composeWithDevTools } from 'redux-devtools-extension'

const logger = createLogger()
const middleware = [ReduxThunk]//, logger]

const initialState = {
  navCreateStudent: {
    email: false,
    student: false,
    photo: false,
    attachments: false,
    location: '/'
  },
  login: false,
  token: '',
  loginAdmin: false,
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

const persistConfig = {
  key: 'root',
  storage
}

const persistedReducer = persistReducer(persistConfig, Reducer)

const store = createStore(
  persistedReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
)
const persistor = persistStore(store)

export { store, persistor, initialState }
