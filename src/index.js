import { render } from 'react-dom'
import React from 'react'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'
import root from 'window-or-global'

import App from 'App'
import { apolloClient } from 'utils/apollo'
import {
  OPEN_INFOMATION_DIALOG,
  CONFIRM_INFOMATION_DIALOG,
} from 'constant-electron'

if (root.isElectron) {
  const electron = window.require('electron')
  const { ipcRenderer } = electron
  render(
    <MemoryRouter
      getUserConfirmation={(message, callback) => {
        ipcRenderer.on(CONFIRM_INFOMATION_DIALOG, (event, index) => {
          if (index === 0) callback(true)
          else callback(false)
        })
        ipcRenderer.send(OPEN_INFOMATION_DIALOG, message)
      }}
    >
      <ApolloProvider client={apolloClient()}>
        <App />
      </ApolloProvider>
    </MemoryRouter>,
    document.getElementById('root')
  )
} else {
  render(
    <BrowserRouter>
      <ApolloProvider client={apolloClient()}>
        <App />
      </ApolloProvider>
    </BrowserRouter>,
    document.getElementById('root')
  )
}
