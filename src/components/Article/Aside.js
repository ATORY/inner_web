import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import ReactRouterPropTypes from 'react-router-prop-types'
import { Button, ButtonGroup } from 'reactstrap'
import {
  faBookmark as solidBookmark,
  faThumbsUp as solidThumbsUp,
} from '@fortawesome/free-solid-svg-icons'
import { faWeixin } from '@fortawesome/free-brands-svg-icons'
import {
  faBookmark as regularBookmark,
  faThumbsUp as regularThumbsUp,
} from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Query, Mutation } from 'react-apollo'

import { PATH_LOGIN, ARTICLE_ASIDE_TYPE } from 'utils/constant'
import { IS_LOGGED_IN, THUMBSUP_MARK_ARTICLE, ARTICLE } from 'utils/apollo'

export const distance = 550

const Aside = ({
  match,
  history,
  articleId,
  mark,
  thumbsUp,
  thumbsUpNum,
  absolute,
  absoluteTop,
}) => {
  const thumbsUpOps = (e, { isLoggedIn, thumbsUpMarkArticle, up, m }) => {
    if (!isLoggedIn) {
      history.push(PATH_LOGIN, {
        modal: true,
        toPath: match.url,
      })
    } else {
      const variables = {
        id: match.params.id,
      }
      const aside = {
        __typename: 'ArticleAside',
        thumbsUpNum,
        mark,
        thumbsUp,
      }
      if (up !== undefined) {
        aside.thumbsUp = !up
        if (aside.thumbsUp) aside.thumbsUpNum += 1
        else aside.thumbsUpNum -= 1
        variables.thumbsUp = aside.thumbsUp
        variables.type = ARTICLE_ASIDE_TYPE.THUMBSUP
      }
      if (m !== undefined) {
        variables.mark = !m
        variables.type = ARTICLE_ASIDE_TYPE.MARK
        aside.mark = !m
      }
      thumbsUpMarkArticle({
        variables,
        optimisticResponse: {
          __typename: 'Mutation',
          article: {
            __typename: 'Article',
            id: articleId,
            aside,
          },
        },
        update: (proxy, { data: { article } }) => {
          const cacheData = proxy.readQuery({
            query: ARTICLE,
            variables: { id: articleId },
          })
          cacheData.article.aside = article.aside
          proxy.writeQuery({
            query: ARTICLE,
            variables: { id: articleId },
            data: cacheData,
          })
        },
      })
    }
  }

  return (
    <Query query={IS_LOGGED_IN}>
      {({ data: { isLoggedIn } }) => (
        <div className="aside">
          <div
            style={{
              top: absolute ? `${absoluteTop - distance + 300}px` : '300px',
              position: absolute ? 'absolute' : '',
            }}
          >
            <Mutation mutation={THUMBSUP_MARK_ARTICLE} onCompleted={() => {}}>
              {thumbsUpMarkArticle => (
                <ButtonGroup vertical className="vertical">
                  <Button
                    onClick={e =>
                      thumbsUpOps(e, {
                        isLoggedIn,
                        thumbsUpMarkArticle,
                        up: thumbsUp,
                      })
                    }
                  >
                    <span className="count">{thumbsUpNum}</span>
                    <FontAwesomeIcon
                      icon={thumbsUp ? solidThumbsUp : regularThumbsUp}
                    />
                  </Button>
                  <Button>
                    <FontAwesomeIcon icon={faWeixin} />
                  </Button>
                  <Button
                    onClick={e =>
                      thumbsUpOps(e, {
                        isLoggedIn,
                        thumbsUpMarkArticle,
                        m: mark,
                      })
                    }
                  >
                    <FontAwesomeIcon
                      icon={mark ? solidBookmark : regularBookmark}
                    />
                  </Button>
                </ButtonGroup>
              )}
            </Mutation>
          </div>
        </div>
      )}
    </Query>
  )
}

Aside.propTypes = {
  absoluteTop: PropTypes.number.isRequired,
  absolute: PropTypes.bool.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  articleId: PropTypes.string.isRequired,
  mark: PropTypes.bool.isRequired,
  thumbsUp: PropTypes.bool.isRequired,
  thumbsUpNum: PropTypes.number.isRequired,
}

export default withRouter(Aside)
