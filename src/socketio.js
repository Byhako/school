import socketio from 'socket.io-client'
import config from './config'
import { store } from '@/config/store'

let socket = null
const DEBUG = true
const LOG = (msg) => DEBUG && console.log(msg)

// Connection State
const CONNECTED = 0

function subscriptions () {
  subscribe('ID2OCR', (data) => {
    console.log('socket detection', data)
    if (store.getState().tabActive === 'tab1') {
      const detection = {tab: 'tab1', ...data}
      store.dispatch({ type: 'SAVE_DETECTION', detection })
    } else {
      const detection = {tab: 'tab2', ...data}
      store.dispatch({ type: 'SAVE_DETECTION', detection })
    }
  })

  // photoMatch
  subscribe('photoMatch', (data) => {
    LOG(data)
    console.log('photoMached OK', data)
    store.dispatch({ type: 'SET_PHOTOMACHED', photoMached: data.match })
  })

  // search
  subscribe('search', (data) => {
    console.log('socket search:', data)
    if (data.match) {
      store.dispatch({ type: 'SET_PHOTOSEARCHMATCH', photoSearchMatch: 'match' })
      store.dispatch({ type: 'SET_IDSTUDENT', idStudentSearch: data.student_id })
    } else {
      store.dispatch({ type: 'SET_PHOTOSEARCHMATCH', photoSearchMatch: 'noMatch' })
    }
  })
}

function connect (id) {
  LOG('connecting to WS ...')
  socket = socketio.connect(config.WEBSOCKETS_URL)
  socket.on('connect', () => {
    id = id || socket.id
    LOG(`connected to WS ${id}`)
    subscriptions()
    publish('student_id', id)
  })
}

function subscribe (channel, fn) {
  if (socket) {
    LOG('Subscribed to ' + channel)
    socket.on(channel, fn)
  }
}

function publish (channel, payload) {
  socket.emit(channel, payload)
}

function disconnect () {
  socket.close()
}

export default {
  subscribe,
  publish,
  connect,
  disconnect,
  get_id: () => socket.id
}
