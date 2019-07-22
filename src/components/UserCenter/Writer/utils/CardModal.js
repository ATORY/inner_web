/* eslint-disable no-return-assign */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './card_modal.scss'

export default class CardModal extends React.Component {
  static defaultProps = {
    isOpen: false,
    cancel: () => {},
    title: '',
    imgUri: '',
    tags: [],
    categorys: [],
    intro: '',
  }

  static propTypes = {
    isOpen: PropTypes.bool,
    cancel: PropTypes.func,
    title: PropTypes.string,
    intro: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    categorys: PropTypes.arrayOf(PropTypes.string),
    imgUri: PropTypes.string,
    publish: PropTypes.func.isRequired,
    setTags: PropTypes.func.isRequired,
    removeTag: PropTypes.func.isRequired,
    setCategorys: PropTypes.func.isRequired,
    removeCategorys: PropTypes.func.isRequired,
    setIntro: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.tagRef = React.createRef()
    this.categoryRef = React.createRef()
  }

  render() {
    const {
      isOpen,
      cancel,
      title,
      imgUri,
      publish,
      categorys,
      tags,
      intro,
      setTags,
      removeTag,
      setCategorys,
      removeCategorys,
      setIntro,
    } = this.props
    return (
      <Modal isOpen={isOpen} toggle={cancel} className="card-modal">
        <ModalHeader>设置文章卡片</ModalHeader>
        <ModalBody>
          <div className="card">
            <div className="snap-img">
              {imgUri && <img alt="intro" src={imgUri} />}
            </div>
            <input
              type="text"
              value={title}
              disabled
              placeholder="请在文章中输入以# 开头的标题"
            />
            <div>
              <span>标签</span>
              {tags.map((t, i) => (
                <span
                  role="presentation"
                  key={t}
                  className="tag"
                  onClick={() => removeTag(i)}
                >
                  {t}
                  <FontAwesomeIcon icon={faTimesCircle} />
                </span>
              ))}
              <input
                type="text"
                placeholder="输入标签后回车添加"
                ref={r => (this.tagRef = r)}
                onKeyDown={setTags}
              />
            </div>
            <div>
              <span>类别</span>
              {categorys.map((c, i) => (
                <span
                  key={c}
                  role="presentation"
                  className="category"
                  onClick={() => removeCategorys(i)}
                >
                  {c}
                  <FontAwesomeIcon icon={faTimesCircle} />
                </span>
              ))}
              <input
                type="text"
                placeholder="输入标签后回车添加"
                ref={r => (this.categoryRef = r)}
                onKeyDown={setCategorys}
              />
            </div>
            <textarea value={intro} placeholder="简介" onChange={setIntro} />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={cancel}>
            取消
          </Button>
          <Button
            color="primary"
            onClick={() => publish({ intro, tags, categorys })}
          >
            发布
          </Button>
        </ModalFooter>
      </Modal>
    )
  }
}
