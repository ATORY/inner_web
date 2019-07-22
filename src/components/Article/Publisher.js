import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import ReactRouterPropTypes from 'react-router-prop-types'
import moment from 'moment'
import { Button } from 'reactstrap'
import { Mutation, Query } from 'react-apollo'

import { FOCUS_ON, IS_LOGGED_IN } from 'utils/apollo'
import { PATH_LOGIN, PATH_REMEMBER_PRE } from 'utils/constant'

class Publisher extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasFocus: props.publisher.hasFocus,
    }
  }

  render() {
    const { publisher, published, history, match } = this.props
    const { hasFocus } = this.state
    return (
      <Query query={IS_LOGGED_IN}>
        {({ data: { isLoggedIn } }) => (
          <Mutation
            mutation={FOCUS_ON}
            onCompleted={() => {
              this.setState({ hasFocus: !hasFocus })
            }}
          >
            {mutation => (
              <Link to={`${PATH_REMEMBER_PRE}/${publisher.id}`}>
                <div className="publisher">
                  <img src={publisher.avator} alt="" />
                  <div>
                    <p>{publisher.username}</p>
                    <span>{moment(published).format('YYYY-MM-DD hh:mm')}</span>
                  </div>
                  <Button
                    outline
                    color="primary"
                    onClick={e => {
                      e.preventDefault()
                      e.stopPropagation()
                      if (!isLoggedIn) {
                        history.push(PATH_LOGIN, {
                          modal: true,
                          toPath: match.url,
                        })
                        return
                      }
                      mutation({
                        variables: {
                          userId: publisher.id,
                          add: !hasFocus,
                        },
                      })
                    }}
                  >
                    {hasFocus ? '取消关注' : '关注'}
                  </Button>
                </div>
              </Link>
            )}
          </Mutation>
        )}
      </Query>
    )
  }
}

Publisher.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  publisher: PropTypes.shape({
    id: PropTypes.string,
    username: PropTypes.string,
    avator: PropTypes.string,
    hasFocus: PropTypes.bool,
  }).isRequired,
  published: PropTypes.string.isRequired,
}

export default withRouter(Publisher)
