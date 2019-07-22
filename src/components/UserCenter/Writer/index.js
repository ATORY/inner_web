import React from 'react'
import { Query } from 'react-apollo'
import ReactRouterPropTypes from 'react-router-prop-types'

import Loading from 'components/Loading'
import Layout from 'components/Layout'
import { ARTICLE } from 'utils/apollo'
// import InnerEditor from './InnerEditor'
import InnerDraft from './InnerDraft'

const WriterPage = ({ match }) => (
  <Layout isUserCenter needAuth>
    {() => {
      if (match.params.id === 'new') {
        return <InnerDraft />
      }
      return (
        <Query
          query={ARTICLE}
          variables={{
            id: match.params.id,
          }}
        >
          {({ loading, error, data }) => {
            if (loading) return <Loading />
            if (error) return <div>err</div>
            const { article } = data
            return <InnerDraft {...article} />
          }}
        </Query>
      )
    }}
  </Layout>
)

WriterPage.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
}

export default WriterPage
