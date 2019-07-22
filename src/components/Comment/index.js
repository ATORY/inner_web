import React from 'react'
import PropTypes from 'prop-types'
import { Mutation, Query } from 'react-apollo'
// import { withRouter } from 'react-router-dom'
// import ReactRouterPropTypes from 'react-router-prop-types'

import Draft from 'components/UserCenter/Writer/Editor'
import Viewer from 'components/UserCenter/Writer/Viewer'
import {
  SUBMIT_COMMENT,
  // ARTICLE,
  IS_LOGGED_IN,
  // GET_PROFILE,
} from 'utils/apollo'

import Toolbar from './Toolbar'
import './index.scss'

class Comment extends React.Component {
  static defaultProps = {
    onSubmit: () => '',
    to: '',
    parent: '',
  }

  static propTypes = {
    to: PropTypes.string,
    refer: PropTypes.string.isRequired,
    parent: PropTypes.string,
    parentType: PropTypes.string.isRequired,
    onSubmit: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      mdStr: '',
      preview: false,
    }
    this.draft = React.createRef()
  }

  updateMDStr = mdStr => {
    this.setState({ mdStr })
  }

  showPreview = () => {
    const { preview } = this.state
    this.setState({ preview: !preview })
  }

  handleCMD = (e, cmd) => {
    this.draft.handleCMD(cmd)
  }

  render() {
    const { to, refer, parent, parentType, onSubmit } = this.props
    const { mdStr, preview } = this.state
    // console.log('parent', parent, refer)
    return (
      <Query query={IS_LOGGED_IN}>
        {({ data: { isLoggedIn } }) => (
          <Mutation
            mutation={SUBMIT_COMMENT}
            onCompleted={() => {
              this.setState({ mdStr: '' })
            }}
          >
            {(
              submitComment,
              {
                // loading, error, data,
                client,
              }
            ) => (
              <div className="container comment">
                <Toolbar
                  showPreview={this.showPreview}
                  preview={preview}
                  handleCMD={this.handleCMD}
                  submit={() => {
                    if (!mdStr) return
                    onSubmit({
                      mutation: submitComment,
                      client,
                      isLoggedIn,
                      datas: {
                        mdStr,
                        to,
                        refer,
                        parent,
                        parentType,
                      },
                    })
                  }}
                />
                <div>
                  {preview ? (
                    <Viewer mdStr={mdStr} />
                  ) : (
                    <Draft
                      // eslint-disable-next-line no-return-assign
                      ref={r => (this.draft = r)}
                      placeholder="留下评论"
                      mdStr={mdStr}
                      callbackMD={this.updateMDStr}
                    />
                  )}
                </div>
              </div>
            )}
          </Mutation>
        )}
      </Query>
    )
  }
}

export default Comment
