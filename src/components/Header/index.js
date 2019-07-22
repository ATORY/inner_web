import React from 'react'
import PropTypes from 'prop-types'
import ReactRouterPropTypes from 'react-router-prop-types'
import { Link, withRouter } from 'react-router-dom'
import { Mutation, Query } from 'react-apollo'
import { Navbar, Nav, NavItem, Button } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPencilAlt,
  faSearch,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons'

import {
  PATH_INDEX,
  PATH_LOGIN,
  PATH_USER_CENTER_WRITER_NEW,
} from 'utils/constant'
import { UPDATE_ASIDE_MINI_STATUS, GET_PROFILE } from 'utils/apollo'
import Container from './Container'
import './index.scss'

const AvatorMutation = ({ isAsideMini, user }) => (
  <Mutation mutation={UPDATE_ASIDE_MINI_STATUS}>
    {UpdateAsideStatus => (
      <NavItem
        onClick={() =>
          UpdateAsideStatus({ variables: { isAsideMini: !isAsideMini } })
        }
      >
        <img alt="avator" className="avator" src={user.avator} />
      </NavItem>
    )}
  </Mutation>
)

AvatorMutation.defaultProps = {
  user: {
    avator: '',
  },
}

AvatorMutation.propTypes = {
  isAsideMini: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    avator: PropTypes.string,
  }),
}

const Header = ({ isLoggedIn, isAsideMini, match, history }) => {
  const { path } = match
  const backBtn =
    path === '/article/:id' ? (
      <NavItem className={match.path === '/' ? 'active' : ''}>
        <Button onClick={() => history.goBack()}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </Button>
      </NavItem>
    ) : null
  const appendClass = isLoggedIn ? 'home auth' : 'home noauth'
  return (
    <Container appendClass={appendClass}>
      <Navbar expand="md">
        <Nav navbar>
          <NavItem className="active">
            <Link to={PATH_INDEX}>首页</Link>
          </NavItem>
        </Nav>
        <Nav className="ml-auto right-nav" navbar>
          {backBtn}
          <NavItem>
            <Button>
              <FontAwesomeIcon icon={faSearch} />
            </Button>
          </NavItem>
          <NavItem>
            <Button
              type="button"
              className="btn writer"
              onClick={() => {
                if (isLoggedIn) history.push(PATH_USER_CENTER_WRITER_NEW)
                else
                  history.push(PATH_LOGIN, {
                    modal: true,
                    toPath: PATH_USER_CENTER_WRITER_NEW,
                  })
              }}
            >
              <FontAwesomeIcon icon={faPencilAlt} />
              <span>记录</span>
            </Button>
          </NavItem>
          {isLoggedIn ? (
            <Query query={GET_PROFILE}>
              {({ data: { profile } }) => (
                <AvatorMutation isAsideMini={isAsideMini} user={profile} />
              )}
            </Query>
          ) : (
            <NavItem>
              <Link
                to={{
                  pathname: '/login',
                  // this is the trick!
                  state: { modal: true },
                }}
              >
                登录
              </Link>
            </NavItem>
          )}
        </Nav>
      </Navbar>
    </Container>
  )
}

Header.propTypes = {
  // isAside: PropTypes.bool.isRequired,
  isAsideMini: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
}

export default withRouter(Header)
