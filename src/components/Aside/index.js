import React from 'react'
import PropTypes from 'prop-types'
import { Mutation, Query, Subscription, ApolloConsumer } from 'react-apollo'
import {
  faAlignLeft,
  faAlignRight,
  faCog,
  faHome,
  faPencilAlt,
  faBookmark,
  // faDraftingCompass,
  faFileAlt,
  faImage,
  faBell,
  faUserFriends,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons'
import { faCloudsmith } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Nav, NavItem } from 'reactstrap'
import { Link, withRouter } from 'react-router-dom'
import ReactRouterPropTypes from 'react-router-prop-types'
import root from 'window-or-global'

import {
  PATH_INDEX,
  PATH_USER_CENTER,
  // USER_CENTER_WRITER,
  PATH_USER_CENTER_WRITER_NEW,
  PATH_USER_CENTER_WRITER_ID,
  PATH_USER_CENTER_ARTICLE,
  // PATH_USER_CENTER_DRAFT,
  PATH_USER_CENTER_BOOKMARK,
  PATH_USER_CENTER_FOCUS,
  PATH_USER_CENTER_IMAGE,
  PATH_USER_CENTER_MESSAGE,
  PATH_USER_CENTER_PLAN,
} from 'utils/constant'
import {
  UPDATE_ASIDE_MINI_STATUS,
  GET_PROFILE,
  MESSAGE_SUBSCRIPTION,
  LOGOUT_USER,
} from 'utils/apollo'
import Loading from 'components/Loading'

import './index.scss'

const MiniAsideBtn = ({ isAsideMini }) => (
  <Mutation mutation={UPDATE_ASIDE_MINI_STATUS}>
    {updateAsideMiniStatus => (
      <Button
        type="button"
        className="icon-btn"
        onClick={() =>
          updateAsideMiniStatus({ variables: { isAsideMini: !isAsideMini } })
        }
      >
        <FontAwesomeIcon icon={isAsideMini ? faAlignRight : faAlignLeft} />
      </Button>
    )}
  </Mutation>
)

MiniAsideBtn.propTypes = {
  isAsideMini: PropTypes.bool.isRequired,
}

const Aside = ({ isAsideMini, match, history }) => (
  <Query query={GET_PROFILE}>
    {({ loading, error, data: { profile } }) => {
      if (loading) return <Loading />
      if (error) return <div>error</div>
      return (
        <div className={`inner-aside ${isAsideMini && 'inner-aside-mini'}`}>
          <div className="inner-logo-header">
            <div
              style={{
                display: isAsideMini ? 'none' : 'block',
              }}
            >
              <img
                className="logo"
                alt="logo"
                src={root.isElectron ? './logo.png' : '/logo.png'}
              />
            </div>
            <MiniAsideBtn isAsideMini={isAsideMini} />
          </div>
          <div className="inner-aside-nav">
            <Nav vertical>
              <NavItem className={match.path === PATH_INDEX ? 'active' : ''}>
                <Link to={PATH_INDEX}>
                  <FontAwesomeIcon icon={faHome} />
                  <div className="inner-aside-item">首页</div>
                </Link>
              </NavItem>
              <NavItem
                className={
                  match.path === PATH_USER_CENTER_WRITER_ID ? 'active' : ''
                }
              >
                <Link to={PATH_USER_CENTER_WRITER_NEW}>
                  <FontAwesomeIcon icon={faPencilAlt} />
                  <div className="inner-aside-item">记录</div>
                </Link>
              </NavItem>
              <NavItem
                className={
                  match.path === PATH_USER_CENTER_ARTICLE ? 'active' : ''
                }
              >
                <Link to={PATH_USER_CENTER_ARTICLE}>
                  <FontAwesomeIcon icon={faFileAlt} />
                  <div className="inner-aside-item">文章</div>
                </Link>
              </NavItem>
              <NavItem
                className={
                  match.path === PATH_USER_CENTER_IMAGE ? 'active' : ''
                }
              >
                <Link to={PATH_USER_CENTER_IMAGE}>
                  <FontAwesomeIcon icon={faImage} />
                  <div className="inner-aside-item">图库</div>
                </Link>
              </NavItem>
              <NavItem
                className={
                  match.path === PATH_USER_CENTER_BOOKMARK ? 'active' : ''
                }
              >
                <Link to={PATH_USER_CENTER_BOOKMARK}>
                  <FontAwesomeIcon icon={faBookmark} />
                  <div className="inner-aside-item">收藏</div>
                </Link>
              </NavItem>
              <Subscription
                subscription={MESSAGE_SUBSCRIPTION}
                variables={{ userId: profile.id }}
              >
                {({ data }) => (
                  <NavItem
                    className={
                      match.path === PATH_USER_CENTER_MESSAGE ? 'active' : ''
                    }
                  >
                    <Link to={PATH_USER_CENTER_MESSAGE}>
                      {match.path !== PATH_USER_CENTER_MESSAGE &&
                        data && <span className="message-tint" />}
                      <FontAwesomeIcon icon={faBell} />
                      <div className="inner-aside-item">消息</div>
                    </Link>
                  </NavItem>
                )}
              </Subscription>
              <NavItem
                className={
                  match.path === PATH_USER_CENTER_FOCUS ? 'active' : ''
                }
              >
                <Link to={PATH_USER_CENTER_FOCUS}>
                  <FontAwesomeIcon icon={faUserFriends} />
                  <div className="inner-aside-item">关注</div>
                </Link>
              </NavItem>
              <NavItem
                className={match.path === PATH_USER_CENTER_PLAN ? 'active' : ''}
              >
                <Link to={PATH_USER_CENTER_PLAN}>
                  <FontAwesomeIcon icon={faCloudsmith} />
                  <div className="inner-aside-item">计划</div>
                </Link>
              </NavItem>
              <NavItem
                className={match.path === PATH_USER_CENTER ? 'active' : ''}
              >
                <Link to={PATH_USER_CENTER}>
                  <FontAwesomeIcon icon={faCog} />
                  <div className="inner-aside-item">设置</div>
                </Link>
              </NavItem>
            </Nav>
          </div>
          <ApolloConsumer>
            {client => (
              <Mutation
                mutation={LOGOUT_USER}
                onCompleted={() => {
                  localStorage.setItem('token', '')
                  client.writeData({
                    data: {
                      isLoggedIn: false,
                      token: '',
                    },
                  })
                  history.push(PATH_INDEX)
                }}
              >
                {logout => (
                  <div
                    role="presentation"
                    className="inner-aside-avator"
                    onClick={() => {
                      logout()
                    }}
                  >
                    {/* <img alt="avator" src={profile && profile.avator} /> */}
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    <div className="inner-aside-item">退出</div>
                  </div>
                )}
              </Mutation>
            )}
          </ApolloConsumer>
        </div>
      )
    }}
  </Query>
)

Aside.propTypes = {
  isAsideMini: PropTypes.bool.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
}

export default withRouter(Aside)
