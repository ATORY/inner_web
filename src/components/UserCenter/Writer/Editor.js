/* eslint-disable no-return-assign */
import React from 'react'
import PropTypes from 'prop-types'

import { Editor, EditorState, ContentState } from 'draft-js'
import 'draft-js/dist/Draft.css'

import {
  eventEmitter,
  EVENT_CMD,
  EVENT_LOCAL_FILE_LOAD,
} from 'utils/eventCenter'

import {
  getPlainText,
  getMarkdownStateFromDraftState,
  buildNewDraftState,
} from './utils/draftUtil'
import { addTab } from './utils/markdownUtil'

export default class Draft extends React.Component {
  static defaultProps = {
    callbackMD: () => {},
    mdStr: '',
    placeholder: '记录属于你的',
    // isLoggedIn: false,
  }

  static propTypes = {
    placeholder: PropTypes.string,
    mdStr: PropTypes.string,
    callbackMD: PropTypes.func,
    // isLoggedIn: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = {
      draftState: props.mdStr
        ? EditorState.createWithContent(
            ContentState.createFromText(props.mdStr)
          )
        : EditorState.createEmpty(),
    }
    this.editor = ''
  }

  componentDidMount() {
    this.focusEditor()
    eventEmitter.on(EVENT_CMD, this.handleCMD)
    eventEmitter.on(EVENT_LOCAL_FILE_LOAD, this.handleLocalLoad)
  }

  // componentWillReceiveProps(nextProps) {
  //   const { mdStr } = this.props
  //   if (!nextProps.mdStr && mdStr) {
  //     const draftState = nextProps.mdStr
  //       ? EditorState.createWithContent(
  //           ContentState.createFromText(nextProps.mdStr)
  //         )
  //       : EditorState.createEmpty()
  //     this.setState({
  //       draftState,
  //     })
  //   }
  // }

  componentWillUnmount() {
    eventEmitter.removeListener(EVENT_CMD, this.handleCMD)
  }

  handleCMD = (command, value) => {
    if (!command || !command.execute) return
    const { draftState } = this.state
    const newEditorState = command.execute(draftState, value)
    this.onChange(newEditorState)
  }

  handleLocalLoad = mdStr => {
    this.onChange(
      EditorState.createWithContent(ContentState.createFromText(mdStr))
    )
  }

  onChange = editorState => {
    const { callbackMD } = this.props
    const plainText = getPlainText(editorState)
    this.setState({
      draftState: editorState,
    })
    callbackMD(plainText)
  }

  handleTab = event => {
    event.preventDefault()
    const { draftState } = this.state
    let mdState = getMarkdownStateFromDraftState(draftState)
    mdState = addTab(mdState, event.shiftKey)
    const newDraftState = buildNewDraftState(draftState, mdState)
    this.onChange(newDraftState)
  }

  handleCommand = command => {
    if (!command.execute) return
    const newEditorState = command.execute(this.cachedDraftState)
    this.onChange(newEditorState)
  }

  focusEditor = () => {
    if (this.editor) {
      this.editor.focus()
    }
  }

  render() {
    const { placeholder } = this.props
    const { draftState } = this.state
    return (
      <Editor
        // readOnly={!isLoggedIn}
        ref={r => (this.editor = r)}
        // editorState={this.cachedDraftState}
        editorState={draftState}
        onChange={this.onChange}
        onTab={this.handleTab}
        placeholder={placeholder}
      />
    )
  }
}
