/* eslint-disable no-return-assign */
import React from 'react'
import { withRouter } from 'react-router-dom'
import ReactRouterPropTypes from 'react-router-prop-types'
import { Query } from 'react-apollo'
import { Helmet } from 'react-helmet'
import moment from 'moment'

// import { Button } from 'reactstrap'

import Layout from 'components/Layout'
import { ARTICLE, GET_PROFILE } from 'utils/apollo'
import Viewer from 'components/UserCenter/Writer/Viewer'
import Loading from 'components/Loading'
import Comment from 'components/Comment'
import CommentList from 'components/Comment/List'
import { COMMENT_TYPE, PATH_LOGIN } from 'utils/constant'

import Aside, { distance } from './Aside'
import Publisher from './Publisher'
import './index.scss'

class Article extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      asideAbsolute: false,
      asideAbsoluteTop: 0,
    }
    this.commentRef = React.createRef()
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = () => {
    if (this.commentRef.offsetTop - window.scrollY > distance) {
      this.setState({
        asideAbsolute: false,
        asideAbsoluteTop: 0,
      })
    } else {
      this.setState({
        asideAbsolute: true,
        asideAbsoluteTop: this.commentRef.offsetTop,
      })
    }
  }

  submitComment = ({ mutation, client, datas, isLoggedIn }) => {
    const { history, match } = this.props
    const { mdStr, to, refer, parent, parentType } = datas

    if (!isLoggedIn) {
      history.push(PATH_LOGIN, {
        modal: true,
        toPath: match.url,
      })
      return
    }

    client
      .query({
        query: GET_PROFILE,
      })
      .then(({ data: { profile: { id, username, avator } } }) => {
        // console.log({ id, username, avator })
        mutation({
          variables: {
            to,
            refer,
            parent,
            parentType,
            content: mdStr,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            comment: {
              __typename: 'Comment',
              id: `${Date.now()}`,
              from: { __typename: 'User', id, username, avator },
              // to: { username, avator, __typename: 'User' },
              published: moment().format(),
              content: mdStr,
            },
          },
          update: (proxy, { data: { comment } }) => {
            const variables = { id: parent }
            const cacheData = proxy.readQuery({
              query: ARTICLE,
              variables,
            })
            cacheData.article.comments.unshift(comment)
            proxy.writeQuery({
              query: ARTICLE,
              variables,
              data: cacheData,
            })
          },
        })
      })
  }

  render() {
    const { asideAbsolute, asideAbsoluteTop } = this.state
    const { match } = this.props
    return (
      <Layout>
        <Query
          query={ARTICLE}
          variables={{
            id: match.params.id,
          }}
        >
          {({ loading, error, data }) => {
            if (loading) return <Loading />
            if (error) return <div>Loading Article Error</div>
            const { article } = data
            const { publisher, published } = article
            return (
              <>
                <Helmet>
                  <title>{article.title}</title>
                </Helmet>
                <div className="articleContainer">
                  <div className="title-info">
                    <h1>{article.title}</h1>
                    <Publisher publisher={publisher} published={published} />
                  </div>
                  <Viewer mdStr={article.content} />
                  <div
                    className="article-comment"
                    ref={r => (this.commentRef = r)}
                  >
                    <Comment
                      to={publisher.id}
                      refer={article.id}
                      parent={article.id}
                      parentType={COMMENT_TYPE.TO_ARTICLE}
                      onSubmit={this.submitComment}
                    />
                    <CommentList
                      comments={article.comments}
                      articleId={article.id}
                    />
                  </div>
                  <section>
                    {/* <h3>{article.title}</h3>
                <span>{match.params.id}</span> */}
                  </section>
                  <Aside
                    {...article.aside}
                    articleId={article.id}
                    absolute={asideAbsolute}
                    absoluteTop={asideAbsoluteTop}
                  />
                </div>
              </>
            )
          }}
        </Query>
      </Layout>
    )
  }
}

Article.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
}

export default withRouter(Article)
