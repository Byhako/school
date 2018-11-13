import config from '../config/index'
import socket from '@/socketio'
import { persistor } from '@/config/store'

export default {
  setEmail, sendDataFile, getUrl, setFile, sendDataMatched, setCode, getProfile, getImage, resetStore,
  login, getStudents, searchStudent, approveStudent, getUrlSearch, setFileSearch
}

function login (email, password, type) {
  return function (dispatch) {
    const url = 'https://181.143.87.202:3000/admin/login'
    const body = {admin: {email, password}}
    const miInit = {
      method: 'POST',

      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }
    console.log(miInit)

    return fetch(url, miInit)
      .then(response => {
        if (response.ok) {
          console.log('Request login ok')
          return response.json()
        } else if (response.status === 401) {
          dispatch({ type: 'SET_LOGIN', state: {login: false, type} })
        }
        else { console.log('Error in request login:', response) }
      })
      .then(data => {
        console.log(data)
        if (data) {
          const login = data.valid
          const token = data.token
          dispatch({ type: 'SET_LOGIN', state: {login, type} })
          dispatch({ type: 'SET_TOKEN', token })
        }
      })
      .catch(err => console.error('Error in response login:', err))
  }
}

function resetStore () {
  return (dispatch) => {
    //persistor.purge()
    dispatch({ type: "CLEAR_STORE" })
  }
}

function setEmail (email, token) {
  return function (dispatch) {
    const url = config.EMAIL_URL
    const body = {'student': {'email': email}}
    const miInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
                 'authorization': `Bearer ${token}`},
      body: JSON.stringify(body)
    }
    console.log('---->', miInit)
    return fetch(url, miInit)
      .then(response => {
        if (response.ok) {
          console.log('Request setEmail ok')
          return response
        } else { console.log('Error in request setEmail:', response) }
      })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if (!data || !data.student._id || data.error) { return }
        dispatch({ type: 'SET_REGISTRATION', id: data.student._id })
        console.log('response:', data)
        socket.connect(data.student._id)
      })
      .catch(err => console.error('Error in response setEmail:', err))
  }
}

function getUrl (data, file, token, tab = 'none') {
  console.log('data:', data)
  return function (dispatch) {
    const url = 'https://181.143.87.202:3000/uploadToken'
    const miInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
                 'authorization': `Bearer ${token}`},
      body: JSON.stringify(data)
    }
    console.log('getUrl:', miInit)
    return fetch(url, miInit)
      .then(response => {
        if (response.ok) {
          console.log('Request getEmail ok')
          return response
        } else { console.log('Error in request getUrl:', response) }
      })
      .then(response => response.json())
      .then(URL => dispatch(setFile(file, URL.upload_url, tab)))
      .catch(err => console.error('Error in response getUrl:', err))
  }
}

function setFile (file, url, tab) {
  return function (dispatch) {
    const miInit = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: file
    }
    console.log('request setFile: ', miInit)
    return fetch(url, miInit)
      .then(response => {
        if (response.ok) {
          console.log('Request setFile ok')
          return response
        } else { console.log('Error in request setFile:', response) }
      })
      .then(data => {
        console.log('response:', data)
        if (tab !== 'none') {
          const processingState = {tab, processing: true}
          dispatch({ type: 'SET_PROCESSING', processingState })
        }
      })
      .catch(err => console.error('Error in response setFile:', err))
  }
}

function sendDataMatched (dataMatched, studentId, token) {
  return function (dispatch) {
    console.log('send:', {student: dataMatched})
    const url = `https://181.143.87.202:3000/students/${studentId}`
    const miInit = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json',
                 'authorization': `Bearer ${token}` },
      body: JSON.stringify({student: dataMatched})
    }

    return fetch(url, miInit)
      .then(response => {
        if (response.ok) {
          console.log('Request dataMatched ok')
          return response
        } else { console.log('Error in request dataMatched:', response) }
      })
      .then(data => console.log('response:', data))
      .catch(err => console.error('Error in response dataMatched:', err))
  }
}

function getImage (side, path) {
  return function (dispatch) {
    if (path) {
      const url = `https://181.143.87.202:3000/downloadToken/${path}`
      const miInit = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
      return fetch(url, miInit)
        .then(response => {
          if (response.ok) {
            console.log('Request getImage ok')
            return response.json()
          } else { console.log('Error in request getImage:', response) }
        })
        .then(data => {
          console.log(side, data)
          if (data) {
            const urlImage = data.download_url
            const dataImage = { side, image: urlImage }
            // console.log('>>>>>>', dataImage)
            dispatch({ type: 'SAVE_IMAGE', dataImage })
          }
        })
        .catch(err => console.error('Error in response getImage:', err))
    }
  }
}

function approveStudent (idStudent, token) {
  return function (dispatch) {
    const url = `https://181.143.87.202:3000/students/${idStudent}/approve`
    const miInit = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json',
                 'authorization': `Bearer ${token}` }
    }

    return fetch(url, miInit)
      .then(response => {
        if (response.ok) {
          console.log('Request approveStudent ok')
          return response.json()
        } else { console.log('Error in request approveStudent:', response) }
      })
      .then(data => {
        console.log(data)
      })
      .catch(err => console.error('Error in response approveStudent:', err))
  }
}

/* ATTACHMENTS */

function sendDataFile (filename, ext, id, file, token) {
  return function (dispatch) {
    const url = `https://181.143.87.202:3000/students/${id}/attachments`
    const miInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
                 'authorization': `Bearer ${token}`},
      body: JSON.stringify({attachment: {filename, ext}})
    }
    console.log('sendDataFile:', miInit)
    return fetch(url, miInit)
      .then(response => {
        if (response.ok) {
          console.log('Request sendDataFile ok')
          return response.json()
        } else { console.log('Error in request sendDataFile:', response) }
      })
      .then(data => {
          console.log(data)
          if (data) {
            dispatch(getUrlAttachments(data._id, file, ext, token))
          }
        })
      .catch(err => console.error('Error in response sendDataFile:', err))
  }
}

function getUrlAttachments (attachment_id, file, ext, token,) {
  return function (dispatch) {
    const url = 'https://181.143.87.202:3000/uploadToken'
    const miInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
                 'authorization': `Bearer ${token}`},
      body: JSON.stringify({attachment_id, ext})
    }
    return fetch(url, miInit)
      .then(response => {
        if (response.ok) {
          console.log('Request getUrlAttachments ok')
          return response.json()
        } else { console.log('Error in request getUrlAttachments:', response) }
      })
      .then(data => {
          console.log(data)
          if (data) {
            dispatch(setFileAttachments(data.upload_url, file))
          }
        })
      .catch(err => console.error('Error in response getUrlAttachments:', err))
  }
}

function setFileAttachments (url, file) {
  return function (dispatch) {
    const miInit = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: file
    }
    return fetch(url, miInit)
      .then(response => {
        if (response.ok) {
          console.log('Request setFileAttachments ok')
          return response
        } else { console.log('Error in request setFileAttachments:', response) }
      })
      .then(data => {
        console.log(data)
      })
      .catch(err => console.error('Error in response setFileAttachments:', err))
  }
}

/*  SEARCH  */

function getProfile (studentId) {
  return function (dispatch) {
    const url = `https://181.143.87.202:3000/students/${studentId}`
    const miInit = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }
    return fetch(url, miInit)
      .then(response => {
        if (response.ok) {
          console.log('Request getProfile ok')
          return response.json()
        } else { console.log('Error in request getProfile:', response) }
      })
      .then(data => {
        console.log(data)
        dispatch({ type: 'SET_PROFILE', profile: data.student })
      })
      .catch(err => console.error('Error in response getProfile:', err))
  }
}

function setCode (code, studentId) {
  return function (dispatch) {
    const url = `https://181.143.87.202:3000/students/${studentId}/otp`
    const miInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({'OTP': code})
    }
    return fetch(url, miInit)
      .then(response => {
        if (response.ok) {
          console.log('Request setCode ok')
          return response.json()
        } else { console.log('Error in request setCode:', response) }
      })
      .then(data => {
        console.log(data)
        if (data.verified) {
          dispatch({ type: 'SET_VERIFIEDCODE', verifiedCode: true })
        } else {
          dispatch({ type: 'SET_VERIFIEDCODE', verifiedCode: false })
        }
      })
      .catch(err => console.error('Error in response setCode:', err))
  }
}

function getUrlSearch (data, file, tab = 'none') {
  return function (dispatch) {
    const url = 'https://181.143.87.202:3000/searchToken'
    const miInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }
    return fetch(url, miInit)
      .then(response => {
        if (response.ok) {
          console.log('Request getUrlSearch ok')
          return response
        } else { console.log('Error in request getUrlSearch:', response) }
      })
      .then(response => response.json())
      .then(URL => dispatch(setFileSearch(file, URL.upload_url, tab)))
      .catch(err => console.error('Error in response getUrlSearch:', err))
  }
}

function setFileSearch (file, url, tab) {
  
  return function (dispatch) {
    const miInit = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: file
    }

    return fetch(url, miInit)
      .then(response => {
        if (response.ok) {
          console.log('Request setFileSearch ok')
          return response
        } else { console.log('Error in request setFileSearch:', response) }
      })
      .then(data => {
        console.log('response:', data)
        if (tab !== 'none') {
          const processingState = {tab, processing: true}
          dispatch({ type: 'SET_PROCESSING', processingState })
        }
      })
      .catch(err => console.error('Error in response setFileSearch:', err))
  }
}

function searchStudent (text, token) {
  return function (dispatch) {
    const url = `https://181.143.87.202:3000/students/search?q=${text}`
    const miInit = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json',
                 'authorization': `Bearer ${token}`}
    }

    return fetch(url, miInit)
      .then(response => {
        if (response.ok) {
          console.log('Request searchStudent ok')
          return response.json()
        } else { 
          console.log('Error in request searchStudent:', response)
          dispatch({ type: 'SET_ERRORSEARCH', error: true })
        }
      })
      .then(data => {
        console.log('data: ', data)
        if (data) {
          dispatch({ type: 'SET_STUDENFOUND', studenFound: data.student })
        }
      })
      .catch(err => console.error('Error in response searchStudent:', err))
  }
}

/* ADMIN */

function getStudents (token) {
  return function (dispatch) {
    const url = 'https://181.143.87.202:3000/students'
    const miInit = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json',
                 'authorization': `Bearer ${token}` }
    }

    return fetch(url, miInit)
      .then(response => {
        if (response.ok) {
          console.log('Request getStudents ok')
          return response.json()
        } else { console.log('Error in request getStudents:', response) }
      })
      .then(students => {
        console.log(students)
        dispatch({ type: 'SET_STUDENTS', students })
      })
      .catch(err => console.error('Error in response getStudents:', err))
  }
}
