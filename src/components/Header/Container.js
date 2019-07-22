import React from 'react'
import { Query } from 'react-apollo'
import PropTypes from 'prop-types'
import root from 'window-or-global'

import { IS_LOGGED_IN } from 'utils/apollo'

import './index.scss'

const HeaderContainer = ({ children, appendClass }) => (
  <Query query={IS_LOGGED_IN}>
    {({ data: { isLoggedIn, isAsideMini } }) => (
      <header className={`bg-secondary inner-header ${appendClass}`}>
        {isLoggedIn && !isAsideMini ? null : (
          <img
            className="logo"
            alt="logo"
            src={root.isElectron ? './logo.png' : '/logo.png'}
          />
        )}
        {children}
      </header>
    )}
  </Query>
)

HeaderContainer.defaultProps = {
  children: <div />,
  appendClass: '',
}

HeaderContainer.propTypes = {
  children: PropTypes.node,
  appendClass: PropTypes.string,
}

export default HeaderContainer
