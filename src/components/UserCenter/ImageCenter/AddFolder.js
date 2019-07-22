import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from 'reactstrap'
import { Mutation } from 'react-apollo'

import { CREATE_FOLDER, GET_FILES } from 'utils/apollo'
import { eventEmitter, EVENT_ADD_FOLDER } from 'utils/eventCenter'

export default class AddFolder extends React.Component {
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
      name: '',
    }
    // this.openAddFolder = this.openAddFolder.bind(this)
  }

  componentDidMount() {
    eventEmitter.on(EVENT_ADD_FOLDER, this.openAddFolder)
  }

  componentWillUnmount() {
    eventEmitter.removeListener(EVENT_ADD_FOLDER, this.openAddFolder)
  }

  openAddFolder = () => {
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
    const { modal, name } = this.state
    return (
      <Mutation
        mutation={CREATE_FOLDER}
        onCompleted={() => {
          // console.log('completed')
          this.setState({
            modal: false,
            name: '',
          })
        }}
      >
        {(createFolder, { loading, error }) => (
          <Modal isOpen={modal} toggle={this.toggle}>
            <ModalHeader toggle={this.toggle}>新建文件夹</ModalHeader>
            <ModalBody>
              <Input
                placeholder="文件夹名"
                value={name}
                onChange={e => this.setState({ name: e.target.value })}
              />
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
                  createFolder({
                    variables: {
                      parentPath,
                      name,
                      path: `${parentPath}/${name}`,
                    },
                    update: (proxy, { data: { file } }) => {
                      // Read the data from our cache for this query.
                      const memData = proxy.readQuery({
                        query: GET_FILES,
                        variables: { parentPath },
                      })
                      memData.files.push(file)
                      proxy.writeQuery({
                        query: GET_FILES,
                        variables: { parentPath },
                        data: memData,
                      })
                    },
                  }).catch(console.error)
                }}
              >
                确定
              </Button>
              {loading && <div>Loading</div>}
              {error && <div>{error.message}</div>}
            </ModalFooter>
          </Modal>
        )}
      </Mutation>
    )
  }
}
