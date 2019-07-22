import React from 'react'
import { Mutation } from 'react-apollo'
import PropTypes from 'prop-types'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'

import {
  // UPLOAD_FILE,
  GET_FILES,
  UPLOAD_FILES,
} from 'utils/apollo'
import { eventEmitter, EVENT_ADD_IMAGE } from 'utils/eventCenter'

export default class AddImage extends React.Component {
  static defaultProps = {
    parentPath: '',
  }

  static propTypes = {
    parentPath: PropTypes.string,
  }

  constructor() {
    super()
    this.state = {
      modal: false,
      upFiles: [],
    }
    this.fileRef = ''
    // this.openAddFolder = this.openAddFolder.bind(this)
  }

  componentDidMount() {
    eventEmitter.on(EVENT_ADD_IMAGE, this.openAddImage)
  }

  componentWillUnmount() {
    eventEmitter.removeListener(EVENT_ADD_IMAGE, this.openAddImage)
  }

  openAddImage = () => {
    this.setState({
      modal: true,
    })
  }

  toggle = () => {
    const { modal } = this.state
    this.setState({
      modal: !modal,
    })
  }

  render() {
    const { parentPath } = this.props
    const { modal, upFiles } = this.state
    const filesNode = []
    for (let i = 0; i < upFiles.length; i += 1) {
      // get item
      const file = upFiles.item(i)
      filesNode.push(
        <div className="item" key={file.name}>
          {/* <span
            role="presentation"
            className="close"
            onClick={e => {
              e.stopPropagation()
              this.removeFile(i)
            }}
          >
            <FontAwesomeIcon icon={faTimesCircle} />
          </span> */}
          <img alt="" src={URL.createObjectURL(file)} />
        </div>
      )
    }
    return (
      <Mutation
        mutation={UPLOAD_FILES}
        onCompleted={() => {
          // console.log('complete', data)
          this.fileRef.value = ''
          this.setState({ modal: false, upFiles: [] })
        }}
      >
        {(uploadFiles, { loading, error }) => (
          <Modal
            className="modal-add-image"
            isOpen={modal}
            toggle={this.toggle}
          >
            <ModalHeader toggle={this.toggle}>上传图片</ModalHeader>
            <ModalBody>
              <div className="modal-image-container">{filesNode}</div>
              <label htmlFor="file-selector">
                <FontAwesomeIcon icon={faUpload} />
                <input
                  id="file-selector"
                  type="file"
                  multiple
                  required
                  // eslint-disable-next-line no-return-assign
                  ref={r => (this.fileRef = r)}
                  onChange={({
                    target: {
                      validity,
                      // files: [file],
                      files,
                    },
                  }) => {
                    // console.log(files)
                    if (validity.valid) this.setState({ upFiles: files })
                  }}
                />
              </label>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.toggle}>
                取消
                {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
              </Button>{' '}
              <Button
                color="primary"
                onClick={e => {
                  e.stopPropagation()
                  uploadFiles({
                    variables: { files: upFiles, parentPath },
                    update: (proxy, { data: { files } }) => {
                      // Read the data from our cache for this query.
                      const memData = proxy.readQuery({
                        query: GET_FILES,
                        variables: { parentPath },
                      })
                      files.forEach(file => {
                        memData.files.push(file)
                      })
                      proxy.writeQuery({
                        query: GET_FILES,
                        variables: { parentPath },
                        data: memData,
                      })
                    },
                  })
                }}
              >
                确定
              </Button>
              {loading && <div>Loading</div>}
              {error && <div>{error.message}</div>}
              {/* {data && console.log('data', data)} */}
            </ModalFooter>
          </Modal>
        )}
      </Mutation>
    )
  }
}
