import React from 'react'
import { Navbar, Nav, NavItem } from 'reactstrap'
import Layout from 'components/Layout'
import HeaderContainer from 'components/Header/Container'
import { Query } from 'react-apollo'

import Loading from 'components/Loading'
import ArticleCard from 'components/ArticleCard'
import { MARKED_ARTICLES } from 'utils/apollo'

import './index.scss'

const UserBookmark = () => (
  <Layout isUserCenter needAuth>
    <div className="inner-wrapper">
      <HeaderContainer appendClass="inner-bookmark">
        <Navbar expand="md">
          <Nav navbar>
            <NavItem>我的收藏</NavItem>
          </Nav>
          {/* <Collapse navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>RIGTH</NavItem>
            </Nav>
          </Collapse> */}
        </Navbar>
      </HeaderContainer>
      <main className="inner-bookmark-main">
        <Query query={MARKED_ARTICLES}>
          {({ data, loading, error }) => {
            if (loading) return <Loading />
            if (error) {
              console.error(error)
              return <div>errr</div>
            }
            const { hasMore, articles } = data.markedArticles
            return (
              <>
                {articles.map(a => (
                  <ArticleCard key={a.id} {...a} />
                ))}
                {hasMore && <div>Load more</div>}
              </>
            )
          }}
        </Query>
      </main>
    </div>
  </Layout>
)

export default UserBookmark
