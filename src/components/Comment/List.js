import React from 'react'
import PropTypes from 'prop-types'
import { withRouter, Link } from 'react-router-dom'
import ReactRouterPropTypes from 'react-router-prop-types'
import moment from 'moment'
import { Modal, ModalBody } from 'reactstrap'
import { Query } from 'react-apollo'

import Loading from 'components/Loading'
import { COMMENTS, GET_PROFILE } from 'utils/apollo'
import Viewer from 'components/UserCenter/Writer/Viewer'
import { COMMENT_TYPE, PATH_LOGIN, PATH_REMEMBER_PRE } from 'utils/constant'

import Comment from './index'
import CommentItem from './Item'

class List extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modalIsOpen: false,
      currentComment: {
        id: '',
        mdStr: '',
        from: {
          id: '',
        },
      },
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
        if (!mdStr) return
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
            const variables = { parent }
            const cacheData = proxy.readQuery({
              query: COMMENTS,
              variables,
            })
            cacheData.comments.unshift(comment)
            proxy.writeQuery({
              query: COMMENTS,
              variables,
              data: cacheData,
            })
          },
        })
      })
  }

  toggle = () => {
    this.setState({ modalIsOpen: false })
  }

  render() {
    const { modalIsOpen, currentComment } = this.state
    const { comments, articleId } = this.props
    return (
      <Query query={COMMENTS} variables={{ parent: currentComment.id }}>
        {({ loading, data, error }) => (
          <div className="comment-list">
            {comments.map(comment => (
              <CommentItem
                key={comment.id}
                comment={comment}
                showModal={() => {
                  this.setState({
                    modalIsOpen: true,
                    currentComment: comment,
                  })
                }}
              />
            ))}
            <Modal
              className="comment-list-modal"
              isOpen={modalIsOpen}
              toggle={this.toggle}
            >
              <ModalBody>
                <div className="from">
                  <Link to={`${PATH_REMEMBER_PRE}/${currentComment.from.id}`}>
                    <div className="user">
                      <img src={currentComment.from.avator} alt="" />
                      <div>{currentComment.from.username}</div>
                    </div>
                  </Link>
                  <Viewer mdStr={currentComment.content} />
                </div>
                <Comment
                  to={currentComment.from.id}
                  refer={articleId}
                  parent={currentComment.id}
                  parentType={COMMENT_TYPE.TO_COMMENT}
                  onSubmit={this.submitComment}
                />
                {(() => {
                  if (loading) return <Loading />
                  if (error) return <div>{error.message}</div>
                  return data.comments.map(comment => (
                    <CommentItem key={comment.id} comment={comment} inModal />
                  ))
                })()}
              </ModalBody>
              {/* <ModalFooter>
                <Button color="primary" onClick={this.toggle}>
                  Do Something
                </Button>
                <Button color="secondary" onClick={this.toggle}>
                  Cancel
                </Button>
              </ModalFooter> */}
            </Modal>
          </div>
        )}
      </Query>
    )
  }
}

List.defaultProps = {
  comments: [],
}

List.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  articleId: PropTypes.string.isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.string,
      from: PropTypes.shape({
        id: PropTypes.string,
        avator: PropTypes.string,
        username: PropTypes.string,
      }),
      to: PropTypes.shape({
        id: PropTypes.string,
        avator: PropTypes.string,
        username: PropTypes.string,
      }),
      published: PropTypes.string,
    })
  ),
}

export default withRouter(List)
