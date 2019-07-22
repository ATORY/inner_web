/* eslint-disable no-console */
import express from 'express'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import React from 'react'
import path from 'path'
import fs from 'fs'
import ReactDOMServer from 'react-dom/server'
import { ApolloProvider, getDataFromTree } from 'react-apollo'
import { StaticRouter } from 'react-router'
import { Helmet } from 'react-helmet'

import AppClient from '../src/App'
import { apolloClient } from '../src/utils/apollo'

import manifest from '../build/asset-manifest.json'

// import indexController from './controllers/index'
const extractAssets = (assets, chunks) =>
  Object.keys(assets)
    .filter(asset => chunks.indexOf(asset.replace('.js', '')) > -1)
    .map(k => assets[k])

const PORT = 3010

// initialize the application and create the routes
const app = express()
// const proxy = httpProxy.createProxyServer({})

const router = express.Router()
router.get('/health', (req, res) => res.send('express'))

const render = (req, res) => {
  const context = {}
  // console.log('req.url', req.url, req.headers)
  // The client-side App will instead use <BrowserRouter>
  const client = apolloClient(req)
  const App = (
    <ApolloProvider client={client}>
      <StaticRouter location={req.url} context={context}>
        <AppClient />
      </StaticRouter>
    </ApolloProvider>
  )

  getDataFromTree(App)
    .then(() => {
      const content = ReactDOMServer.renderToString(App)
      const initialState = client.extract()
      const filePath = path.resolve(__dirname, '../build/index.html')

      const htmlData = fs.readFileSync(filePath, 'utf8')

      const modules = []

      const extraChunks = extractAssets(manifest, modules).map(
        c => `<script type="text/javascript" src="/${c}"></script>`
      )

      // get HTML headers
      const helmet = Helmet.renderStatic()
      res.send(
        htmlData
          .replace('<div id="root"></div>', `<div id="root">${content}</div>`)
          // write the string version of our state
          .replace(
            'window.__APOLLO_STATE__={}',
            `window.__APOLLO_STATE__=${JSON.stringify(initialState)};`
          )
          .replace('</body>', `${extraChunks.join('')}</body>`)
          // write the HTML header tags
          .replace(
            '<title></title>',
            helmet.title.toString() + helmet.meta.toString()
          )
      )
    })
    .catch(err => {
      console.error(err)
      res.send('err')
    })
}

router.get('/', render)
router.get('/article/:id', render)

router.use(
  express.static(path.resolve(__dirname, '../build'), {
    maxAge: '30d',
  })
)
router.get('*', render)
app.use(cookieParser())
app.use(compression())
app.use(router)

// start the app
// Loadable.preloadAll().then(() => {
// })

app.listen(PORT, error => {
  if (error) {
    console.log('something bad happened', error)
    return
  }
  console.log(`listening on ${PORT}...`)
})
