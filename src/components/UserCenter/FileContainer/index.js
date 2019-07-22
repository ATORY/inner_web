import React from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

import FileContainer from 'components/UserCenter/FileContainer/Container'

import './image_modal.scss'

export default class ImageModal extends React.Component {
  constructor() {
    super()
    this.state = {
      value: '',
    }
  }

  setImage = () => {
    const { value } = this.state
    const { selectImage } = this.props
    selectImage(value)
  }

  render() {
    const { isOpen, cancel } = this.props
    const { value } = this.state
    return (
      <Modal isOpen={isOpen} toggle={cancel} className="image-modal">
        <ModalHeader>插入图片</ModalHeader>
        <ModalBody>
          <FileContainer
            value={value}
            backImageValue={uri => this.setState({ value: uri })}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={cancel}>
            取消
          </Button>
          <Button color="primary" onClick={this.setImage}>
            确定
          </Button>
        </ModalFooter>
      </Modal>
    )
  }
}

ImageModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  selectImage: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
}
