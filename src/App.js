// import { render } from 'react-dom'
import React from 'react'
import { Route } from 'react-router-dom'
// import ReactRouterPropTypes from 'react-router-prop-types'
import { Query } from 'react-apollo'
import fontawesome from '@fortawesome/fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faStroopwafel } from '@fortawesome/free-solid-svg-icons'
// import gql from 'graphql-tag'
// import { HttpLink } from 'apollo-link-http'
import 'bootstrap/dist/css/bootstrap.min.css'

// eslint-disable-next-line import/no-unresolved
import './index.css'

// import { PATH_INDEX } from 'utils/constant'
import { AUTH_PAYLOD } from 'utils/apollo'
import Loading from 'components/Loading'
import Routes from 'Routes'

fontawesome.config = {
  autoAddCss: false,
}

library.add(faStroopwafel)

const App = () => (
  <Query query={AUTH_PAYLOD}>
    {({ loading, error, data, client }) => {
      if (loading) return <Loading />
      if (error) return <div>error</div>
      if (data.token) {
        if (process.env.NODE_ENV === 'development')
          localStorage.setItem('token', data.token)
        client.writeData({
          data: { isLoggedIn: true, token: data.token },
        })
        // currPath = PATH_INDEX
        // console.log('currPath', currPath)
        // history.push(PATH_INDEX)
        // if (process.browser && window.location.pathname !== PATH_INDEX) {
        //   window.location.pathname = currPath
        // }
      }
      return <Route component={Routes} />
    }}
  </Query>
)

// App.propTypes = {
//   history: ReactRouterPropTypes.history.isRequired,
//   location: ReactRouterPropTypes.location.isRequired,
// }

export default App
