import React from 'react'
import PropTypes from 'prop-types'
import { Prompt } from 'react-router-dom'
import { Mutation } from 'react-apollo'
import { Button, Modal } from 'reactstrap'

import { SAVE_ARTICLE } from 'utils/apollo'
import {
  eventEmitter,
  EVENT_CMD,
  EVENT_LOCAL_FILE_LOAD,
} from 'utils/eventCenter'
import FileSelector from 'components/UserCenter/FileContainer'

import CardModal from './utils/CardModal'
import DraftTools from './DraftTools'
import Viewer from './Viewer'
import Draft from './Editor'

import './index.scss'

class InnerDraft extends React.Component {
  static defaultProps = {
    id: '',
    content: '',
    snapImg: '',
    categorys: [],
    tags: [],
    intro: '',
  }

  static propTypes = {
    // history: ReactRouterPropTypes.history.isRequired,
    id: PropTypes.string,
    content: PropTypes.string,
    snapImg: PropTypes.string,
    categorys: PropTypes.arrayOf(PropTypes.string),
    tags: PropTypes.arrayOf(PropTypes.string),
    intro: PropTypes.string,
  }

  constructor(props) {
    super(props)
    this.state = {
      id: props.id,
      content: props.content,
      snapImg: props.snapImg,
      categorys: props.categorys,
      tags: props.tags,
      intro: props.intro,
      hasSave: false,
      imgModalOpen: false,
      imgCmd: {},
      cardModalOpen: false,
      modalErr: false,
      leftPercent: 50,
      rightPercent: 50,
    }
    this.cardModalRef = React.createRef()
    this.editorViewRef = React.createRef()
    this.cachedValue = ''
    this.cachedTitle = ''
    this.articleElem = ''
  }

  componentDidUpdate() {
    const node = this.articleElem
    if (!node) return
    const h1 = node.getElementsByTagName('h1')
    if (h1.length > 0) {
      this.cachedTitle = h1[0].innerText
    }
  }

  handleMove = event => {
    const { isResizing } = this.state
    if (isResizing) {
      const editorViewDom = this.editorViewRef.current
      const left =
        (event.clientX - editorViewDom.offsetLeft) / editorViewDom.offsetWidth
      const leftPercent = left * 100
      const rightPercent = (1 - left) * 100
      this.setState({
        leftPercent,
        rightPercent,
      })
    }
  }

  cancelMove = () => {
    this.setState({
      isResizing: false,
    })
  }

  beginMove = () => {
    this.setState({
      isResizing: true,
    })
  }

  handleBtnClick = cmd => {
    eventEmitter.emit(EVENT_CMD, cmd)
  }

  selectImage = imageUrl => {
    const { imgCmd } = this.state
    eventEmitter.emit(EVENT_CMD, imgCmd, { imageUrl })
    this.setState({ imgCmd: {}, imgModalOpen: false, snapImg: imageUrl })
  }

  setTags = e => {
    if (e.keyCode !== 13) return
    const { value } = e.target
    if (!value) return
    const { tags } = this.state
    if (tags.length > 4) return
    if (tags.includes(value)) return
    this.cardModalRef.tagRef.value = ''
    this.setState({
      tags: [...tags, value],
    })
  }

  removeTag = i => {
    const { tags } = this.state
    const newTags = [...tags.slice(0, i), ...tags.slice(i + 1)]
    this.setState({
      tags: newTags,
    })
  }

  setCategorys = e => {
    if (e.keyCode !== 13) return
    const { value } = e.target
    if (!value) return
    const { categorys } = this.state
    if (categorys.length > 1) return
    if (categorys.includes(value)) return
    this.cardModalRef.categoryRef.value = ''
    this.setState({
      categorys: [...categorys, value],
    })
  }

  removeCategorys = i => {
    const { categorys } = this.state
    this.setState({
      categorys: [...categorys.slice(0, i), ...categorys.slice(i + 1)],
    })
  }

  setIntro = e => {
    this.setState({ intro: e.target.value })
  }

  localSaveSuccess = () => {
    this.setState({
      hasSave: true,
    })
  }

  localSaveFail = message => {
    this.setState({
      hasSave: false,
    })
    // eslint-disable-next-line no-console
    console.log(message)
  }

  render() {
    const {
      imgModalOpen,
      cardModalOpen,
      content,
      hasSave,
      modalErr,
      id,
      leftPercent,
      rightPercent,
      isResizing,
      cmd,
      snapImg,
      tags,
      categorys,
      intro,
    } = this.state
    // const { history } = this.props
    return (
      <Mutation
        mutation={SAVE_ARTICLE}
        onCompleted={({ saveArticle }) => {
          this.setState(
            {
              hasSave: true,
              cardModalOpen: false,
              id: saveArticle.id,
            }
            // () => history.push(`/usercenter/writer/${saveArticle.id}`)
          )
        }}
        onError={console.error}
      >
        {(saveArticle, { loading, error }) => (
          <div className="inner-wrapper writer">
            <Prompt
              when={content.length > 0 && !hasSave}
              message={() => '放弃当前编辑？'}
            />
            <CardModal
              /* eslint-disable no-return-assign */
              ref={r => (this.cardModalRef = r)}
              title={this.cachedTitle}
              intro={intro}
              setIntro={this.setIntro}
              tags={tags}
              setTags={this.setTags}
              removeTag={this.removeTag}
              setCategorys={this.setCategorys}
              removeCategorys={this.removeCategorys}
              categorys={categorys}
              imgUri={snapImg}
              isOpen={cardModalOpen}
              cancel={() => this.setState({ cardModalOpen: false })}
              publish={() => {
                const title = this.cachedTitle
                saveArticle({
                  variables: {
                    publish: true,
                    title,
                    snapImg,
                    intro,
                    tags,
                    categorys,
                    content,
                    id,
                  },
                }).catch(console.error)
              }}
            />
            <FileSelector
              isOpen={imgModalOpen}
              selectImage={v => this.selectImage(v)}
              cancel={() => this.setState({ imgModalOpen: false, imgCmd: {} })}
            />
            {error ? (
              <Modal isOpen={modalErr}>
                Error
                <Button
                  color="secondary"
                  onClick={() => this.setState({ modalErr: false })}
                >
                  close
                </Button>
              </Modal>
            ) : (
              <Modal isOpen={loading}>Loading</Modal>
            )}
            <div className="inner-editor">
              <DraftTools
                openTitleModal={() => this.setState({ cardModalOpen: true })}
                openImageModal={(e, imgCmd) =>
                  this.setState({ imgModalOpen: true, imgCmd })
                }
                handleBtn={this.handleBtnClick}
                saveDraft={() => {
                  saveArticle({
                    variables: {
                      publish: false,
                      content,
                      id,
                    },
                  }).catch(console.error)
                }}
                callbackData={mdStr => {
                  eventEmitter.emit(EVENT_LOCAL_FILE_LOAD, mdStr)
                }}
                callbackSaveSuccess={this.localSaveSuccess}
                callbackSaveFail={this.localSaveFail}
                content={content}
              />

              <div
                role="presentation"
                ref={this.editorViewRef}
                onMouseMove={this.handleMove}
                onMouseUp={this.cancelMove}
                className="inner-editor-view-wrapper"
                style={{
                  cursor: isResizing ? 'ew-resize' : '',
                }}
              >
                <div
                  className="editor-item"
                  style={{
                    width: `calc(${leftPercent}% - 1px)`,
                  }}
                >
                  <Draft
                    id={id}
                    mdStr={content}
                    callbackMD={mdStr => this.setState({ content: mdStr })}
                    cmd={cmd}
                  />
                </div>
                {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                <div
                  onMouseDown={this.beginMove}
                  className="split-line"
                  style={{
                    width: '2px',
                    background: '#d3d3d3',
                  }}
                />
                <div
                  className="view-item"
                  style={{
                    width: `calc(${rightPercent}% - 1px)`,
                  }}
                >
                  <Viewer
                    mdStr={content}
                    aritcleRef={el => (this.articleElem = el)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </Mutation>
    )
  }
}

export default InnerDraft
