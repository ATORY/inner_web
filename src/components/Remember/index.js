import React from 'react'
import { Route, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'
import ReactRouterPropTypes from 'react-router-prop-types'
import { Query } from 'react-apollo'
import { Button, Nav, NavItem } from 'reactstrap'

import Layout from 'components/Layout'
import Loading from 'components/Loading'
import { MEMBER_PROFILE } from 'utils/apollo'

import ArticleList from './Articles'
import ArticlesSet from './ArticlesSet'
import './index.scss'

const MenuLink = ({ label, to, activeOnlyWhenExact }) => (
  <Route
    path={to}
    exact={activeOnlyWhenExact}
    // eslint-disable-next-line react/no-children-prop
    children={({ match }) => (
      <NavItem className={match ? 'active' : ''}>
        <Link to={to}>{label}</Link>
      </NavItem>
    )}
  />
)

MenuLink.defaultProps = {
  activeOnlyWhenExact: false,
}

MenuLink.propTypes = {
  label: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  activeOnlyWhenExact: PropTypes.bool,
}

const Remember = ({ match }) => (
  <Layout>
    <Helmet>
      <title>article.title</title>
    </Helmet>
    <div className="remember-container">
      <Query
        query={MEMBER_PROFILE}
        variables={{
          id: match.params.id,
        }}
      >
        {({ loading, error, data }) => {
          if (loading) return <Loading />
          if (error) return <div>error</div>
          const { member } = data
          return (
            <div>
              <div
                className="member-banner"
                style={{
                  backgroundImage: `url('${member.banner}')`,
                }}
              />
              <div className="member-aside">
                <div className="member-profile">
                  <img src={member.avator} alt="" />
                  <div>{member.username}</div>
                  <Button>关注</Button>
                </div>
                <div>{member.signature}</div>
                <div className="member-works">
                  <Nav>
                    <MenuLink activeOnlyWhenExact to={match.url} label="记录" />
                    <MenuLink
                      activeOnlyWhenExact
                      to={`${match.url}/articleset`}
                      label="记录集"
                    />
                  </Nav>
                  <div>
                    <Route
                      exact
                      path={`${match.path}`}
                      render={props => (
                        <ArticleList {...props} id={member.id} />
                      )}
                    />
                    <Route
                      path={`${match.path}/articleset`}
                      render={props => (
                        <ArticlesSet {...props} id={member.id} />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        }}
      </Query>
    </div>
  </Layout>
)

Remember.propTypes = {
  // history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
}

export default Remember
