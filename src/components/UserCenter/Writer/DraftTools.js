/* eslint-disable no-return-assign */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Navbar, Collapse, Nav } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBold,
  faItalic,
  faHeading,
  faQuoteRight,
  faCode,
  faListUl,
  faListOl,
  faImages,
  faSave,
  faCloudUploadAlt,
  faStrikethrough,
  faLink,
  faFileImport,
  faFileExport,
} from '@fortawesome/free-solid-svg-icons'

import HeaderContainer from 'components/Header/Container'
import {
  LOAD_LOCAL_FILE,
  SELECTED_FILE,
  SAVE_FILE,
  SAVE_FILE_STATUS,
  SAVE_FILE_AS,
} from 'constant-electron'

import {
  blodCommand,
  italicCommand,
  headingCommand,
  strikethroughCommand,
  linkCommand,
  quoteCommand,
  codeCommand,
  orderedListCommand,
  unorderedListCommand,
  imageCommand,
} from './utils/commands'

const btns = {
  heading: {
    icon: faHeading,
    cmd: headingCommand,
  },
  bold: {
    icon: faBold,
    cmd: blodCommand,
  },
  italic: {
    icon: faItalic,
    cmd: italicCommand,
  },
  strikethrough: {
    icon: faStrikethrough,
    cmd: strikethroughCommand,
  },
  link: {
    icon: faLink,
    cmd: linkCommand,
  },
  quote: {
    icon: faQuoteRight,
    cmd: quoteCommand,
  },
  code: {
    icon: faCode,
    cmd: codeCommand,
  },
  ul: {
    icon: faListOl,
    cmd: orderedListCommand,
  },
  ol: {
    icon: faListUl,
    cmd: unorderedListCommand,
  },
  media: {
    icon: faImages,
    cmd: imageCommand,
  },
}

const keys = Object.keys(btns)

export default class DraftTools extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.openLocalFileBtn = React.createRef()
    this.saveLocalFileBtn = React.createRef()
    this.saveLocalFileAsBtn = React.createRef()
  }

  componentDidMount() {
    if (window.isElectron) {
      const { callbackData, callbackSaveSuccess, callbackSaveFail } = this.props
      const electron = window.require('electron')
      const { ipcRenderer } = electron
      this.openLocalFileBtn.onClick = () => {
        ipcRenderer.send(LOAD_LOCAL_FILE)
      }

      ipcRenderer.on(SELECTED_FILE, (event, arg) => {
        // const message = `异步消息回复: ${arg}`
        // eslint-disable-next-line no-console
        // console.log('message', message)
        callbackData(arg)
      })

      // save file
      this.saveLocalFileBtn.onClick = () => {
        const { content } = this.props
        ipcRenderer.send(SAVE_FILE, content)
      }

      // save file as
      this.saveLocalFileAsBtn.onClick = () => {
        const { content } = this.props
        ipcRenderer.send(SAVE_FILE_AS, content)
      }

      ipcRenderer.on(SAVE_FILE_STATUS.SUCCESS, callbackSaveSuccess)

      ipcRenderer.on(SAVE_FILE_STATUS.FAIL, (event, message) => {
        callbackSaveFail(message)
      })
    }
  }

  render() {
    const { handleBtn, saveDraft, openImageModal, openTitleModal } = this.props
    return (
      <HeaderContainer>
        <Navbar expand="md">
          <Nav>
            {keys.map(k => {
              if (k === 'media') {
                return (
                  <Button key={k} onClick={e => openImageModal(e, btns[k].cmd)}>
                    <FontAwesomeIcon icon={btns[k].icon} />
                  </Button>
                )
              }
              return (
                <Button key={k} onClick={() => handleBtn(btns[k].cmd)}>
                  <FontAwesomeIcon icon={btns[k].icon} />
                </Button>
              )
            })}
            <Button onClick={openTitleModal}>
              <FontAwesomeIcon icon={faCloudUploadAlt} />
              {' 发布'}
            </Button>
            <Button onClick={saveDraft}>
              <FontAwesomeIcon icon={faSave} />
              {' 存草稿'}
            </Button>
          </Nav>

          {/** electron platform */}
          {window.isElectron && (
            <Collapse navbar>
              <Nav className="ml-auto" navbar>
                <Button ref={r => (this.openLocalFileBtn = r)}>
                  <FontAwesomeIcon icon={faFileImport} />
                  {' 打开'}
                </Button>
                <Button ref={r => (this.saveLocalFileBtn = r)}>
                  <FontAwesomeIcon icon={faFileExport} />
                  {' 保存'}
                </Button>
                <Button ref={r => (this.saveLocalFileAsBtn = r)}>
                  {' SaveAs'}
                </Button>
              </Nav>
            </Collapse>
          )}
        </Navbar>
      </HeaderContainer>
    )
  }
}

DraftTools.defaultProps = {
  callbackData: () => '',
  callbackSaveSuccess: () => '',
  callbackSaveFail: () => '',
  content: '',
}

DraftTools.propTypes = {
  handleBtn: PropTypes.func.isRequired,
  saveDraft: PropTypes.func.isRequired,
  openImageModal: PropTypes.func.isRequired,
  openTitleModal: PropTypes.func.isRequired,
  callbackData: PropTypes.func,
  callbackSaveSuccess: PropTypes.func,
  callbackSaveFail: PropTypes.func,
  content: PropTypes.string,
}
