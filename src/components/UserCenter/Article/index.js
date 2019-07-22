import React from 'react'
import { Navbar, Nav, NavItem, Button } from 'reactstrap'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import { Link, Route } from 'react-router-dom'
import ReactRouterPropTypes from 'react-router-prop-types'

import Loading from 'components/Loading'
import Layout from 'components/Layout'
import HeaderContainer from 'components/Header/Container'
import ArticleCard from 'components/ArticleCard'
import { ARTICLES } from 'utils/apollo'

import ArticleSet from './ArticleSet'
import './index.scss'

const MenuLink = ({ label, to, activeOnlyWhenExact }) => (
  <Route
    path={to}
    exact={activeOnlyWhenExact}
    // eslint-disable-next-line react/no-children-prop
    children={({ match }) => (
      <NavItem>
        <Link to={to}>
          <Button className={match ? 'active' : ''}>{label}</Button>
        </Link>
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

const UserArticle = ({ match }) => (
  <Layout isUserCenter needAuth>
    {({ profile }) => (
      <div className="inner-wrapper">
        <HeaderContainer appendClass="inner-u-article">
          <Navbar expand="md">
            <Nav navbar>
              <MenuLink activeOnlyWhenExact to={match.url} label="我的记录" />
              <MenuLink
                activeOnlyWhenExact
                to={`${match.url}/set`}
                label="我的记录集"
              />
            </Nav>

            {/* <Collapse navbar>
              <Nav className="ml-auto" navbar>
                <NavItem>RIGTH</NavItem>
              </Nav>
            </Collapse> */}
          </Navbar>
        </HeaderContainer>

        <Route
          exact
          path={match.path}
          render={() => {
            if (profile) {
              return (
                <main className="inner-u-article-main">
                  <Query query={ARTICLES} variables={{ belong: profile.id }}>
                    {({ data, loading, error }) => {
                      if (loading) return <Loading />
                      if (error) return <div>errr</div>
                      const { hasMore, articles } = data.articles
                      return (
                        <>
                          {articles.map(a => (
                            <ArticleCard key={a.id} {...a} editable />
                          ))}
                          {hasMore && <div>Load more</div>}
                        </>
                      )
                    }}
                  </Query>
                </main>
              )
            }
            return null
          }}
        />
        <Route path={`${match.path}/set`} component={ArticleSet} />
        {}
      </div>
    )}
  </Layout>
)

UserArticle.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
}

export default UserArticle
