import React from 'react'
import PropTypes from 'prop-types'
import { withRouter, Redirect } from 'react-router-dom'
import ReactRouterPropTypes from 'react-router-prop-types'
import { Query } from 'react-apollo'

import { IS_LOGGED_IN, GET_PROFILE } from 'utils/apollo'
import Aside from 'components/Aside/index'
import Header from 'components/Header/index'
import Loading from 'components/Loading'

import './Layout.scss'

const normalClass = 'container-fluid inner-grid'

const Layout = ({ children, isUserCenter, location, needAuth }) => (
  <Query query={IS_LOGGED_IN}>
    {({ data: { isLoggedIn, isAsideMini } }) => {
      if (needAuth && !isLoggedIn) {
        // console.log(location)
        return (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
      const loginClass = isLoggedIn ? 'inner-auth' : ''
      const isAsideMiniClass = isAsideMini ? 'inner-aside-minimize' : ''
      const mainWarpper = c => (
        <div className={`inner-wrapper ${!isLoggedIn && 'wrapper-noauth'}`}>
          <Header isLoggedIn={isLoggedIn} isAsideMini={isAsideMini} />
          <main className={isLoggedIn ? '' : 'noauth'}>{c}</main>
        </div>
      )
      if (!isLoggedIn) {
        return (
          <div className={`${normalClass} ${loginClass} ${isAsideMiniClass}`}>
            {isLoggedIn ? <Aside isAsideMini={isAsideMini} /> : null}
            {isUserCenter ? children : mainWarpper(children)}
          </div>
        )
      }
      return (
        <Query query={GET_PROFILE}>
          {({ loading, error, data }) => {
            if (loading) return <Loading message="获取资料中..." />
            if (error) return <div>layout GET_PROFILE error</div>
            const { profile } = data
            const child =
              typeof children === 'function' ? children({ profile }) : children
            return (
              <div
                className={`${normalClass} ${loginClass} ${isAsideMiniClass}`}
              >
                {isLoggedIn ? <Aside isAsideMini={isAsideMini} /> : null}
                {isUserCenter ? child : mainWarpper(child)}
              </div>
            )
          }}
        </Query>
      )
    }}
  </Query>
)

Layout.defaultProps = {
  isUserCenter: false,
  needAuth: false,
}
Layout.propTypes = {
  location: ReactRouterPropTypes.location.isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  isUserCenter: PropTypes.bool,
  needAuth: PropTypes.bool,
}

export default withRouter(Layout)
