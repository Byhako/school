import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import AppRoute from './Routers'
import { store, persistor } from '@/config/store'

export default function App () {
  return (
    <Provider store={store}>
      <PersistGate loadding={<h2>Loading...</h2>} persistor={persistor}>
        <AppRoute />
      </PersistGate>
    </Provider>
  )
}
