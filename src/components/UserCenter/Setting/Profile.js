import React from 'react'
import PropTypes from 'prop-types'
import { Mutation } from 'react-apollo'
import { Button } from 'reactstrap'

import { UPDATE_PROFILE } from 'utils/apollo'
import FileSelector from 'components/UserCenter/FileContainer'

export default class Profile extends React.Component {
  static defaultProps = {
    username: '',
    signature: '',
    avator: '',
    banner: '',
  }

  static propTypes = {
    username: PropTypes.string,
    signature: PropTypes.string,
    avator: PropTypes.string,
    banner: PropTypes.string,
  }

  constructor(props) {
    super(props)
    this.state = {
      // id: props.id,
      username: props.username,
      signature: props.signature,
      avator: props.avator,
      banner: props.banner,
      profileEditing: false,
      openSelector: false,
    }
    this.selectingAvator = false
  }

  setSelectImg = v => {
    this.setState({ openSelector: false })
    if (this.selectingAvator) {
      this.setState({ avator: v })
    } else {
      this.setState({ banner: v })
    }
  }

  render() {
    const {
      username,
      signature,
      avator,
      banner,
      profileEditing,
      openSelector,
    } = this.state
    return (
      <Mutation
        mutation={UPDATE_PROFILE}
        onCompleted={() => {
          this.setState({ profileEditing: false })
        }}
      >
        {(updateProfile, { loading }) => (
          <div>
            <FileSelector
              isOpen={openSelector}
              selectImage={v => this.setSelectImg(v)}
              cancel={() => {
                this.selectingAvator = false
                this.setState({ openSelector: false })
              }}
            />
            <div className="banner-container">
              <img src={banner || ''} alt="" />
              <div className="">
                <div>
                  {profileEditing && (
                    <span
                      role="presentation"
                      onClick={() => {
                        this.selectingAvator = false
                        this.setState({ openSelector: true })
                      }}
                    >
                      更换背景图片
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="profile-container">
              <div>
                <div className="avator">
                  <img alt="avator" src={avator} />
                  {profileEditing && (
                    <span
                      role="presentation"
                      onClick={() => {
                        this.selectingAvator = true
                        this.setState({
                          openSelector: true,
                        })
                      }}
                    >
                      更换头像
                    </span>
                  )}
                </div>
                <Button
                  disabled={loading}
                  outline
                  color="primary"
                  size="sm"
                  onClick={() => {
                    if (!profileEditing) {
                      this.setState({ profileEditing: true })
                      return
                    }
                    updateProfile({
                      variables: {
                        username,
                        signature,
                        avator,
                        banner,
                      },
                    }).catch(console.error)
                  }}
                >
                  {profileEditing ? '保存' : '编辑资料'}
                </Button>
              </div>
              <div className="words">
                <input
                  disabled={!profileEditing}
                  value={username}
                  placeholder="昵称"
                  onChange={e => this.setState({ username: e.target.value })}
                />
                <textarea
                  placeholder="签名"
                  disabled={!profileEditing}
                  value={signature}
                  onChange={e => this.setState({ signature: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}
      </Mutation>
    )
  }
}
