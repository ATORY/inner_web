import React from 'react'
import PropTypes from 'prop-types'
import { Query, withApollo } from 'react-apollo'
import { Helmet } from 'react-helmet'

import Layout from 'components/Layout'
import ArticleCard from 'components/ArticleCard/index'
import Loading from 'components/Loading'
import { ARTICLES, WINDOW_SCROLL_Y } from 'utils/apollo'

import './index.scss'

class Home extends React.Component {
  componentDidMount() {
    const { client } = this.props

    const { windowScrollY } = client.readQuery({ query: WINDOW_SCROLL_Y })
    window.scroll(0, windowScrollY)
    window.onscroll = () => {
      client.writeData({ data: { windowScrollY: window.scrollY } })
    }
  }

  componentWillUnmount() {
    window.onscroll = null
  }

  render() {
    return (
      <Layout>
        <Query query={ARTICLES} variables={{ belong: '' }}>
          {({ loading, error, data }) => {
            if (loading) return <Loading />
            if (error) {
              return <div>Error</div>
            }
            const { hasMore, articles } = data.articles
            return (
              <>
                <Helmet>
                  <title>Inner Your Life</title>
                </Helmet>
                <article className="home container">
                  {articles.map(article => (
                    <ArticleCard key={article.id} {...article} />
                  ))}
                  {articles.length % 2 !== 0 && <div />}
                </article>

                <div className="home-loadmore">
                  {hasMore ? 'Load More' : '----没有了----'}
                </div>
              </>
            )
          }}
        </Query>
      </Layout>
    )
  }
}

Home.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  client: PropTypes.any.isRequired,
}

export default withApollo(Home)
