import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'

import { ARTICLES } from 'utils/apollo'
import Loading from 'components/Loading'
import ArticleCard from 'components/ArticleCard'

const ArticleList = ({ id }) => (
  <Query
    query={ARTICLES}
    variables={{
      belong: id,
    }}
  >
    {({ loading, error, data }) => {
      if (loading) return <Loading />
      if (error) return <div>error</div>
      const {
        articles: { articles, hasMore },
      } = data
      return (
        <>
          {articles.map(article => (
            <ArticleCard key={article.id} {...article} />
          ))}
          {hasMore && <div>More</div>}
        </>
      )
    }}
  </Query>
)

ArticleList.propTypes = {
  id: PropTypes.string.isRequired,
}

export default ArticleList
