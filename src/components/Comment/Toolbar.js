import React from 'react'
import PropTypes from 'prop-types'
import { Button, ButtonGroup } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBold,
  faItalic,
  faCode,
  faListUl,
  faListOl,
  faLink,
} from '@fortawesome/free-solid-svg-icons'

import {
  blodCommand,
  italicCommand,
  codeCommand,
  orderedListCommand,
  unorderedListCommand,
  linkCommand,
} from 'components/UserCenter/Writer/utils/commands'

const btns = {
  blod: {
    icon: faBold,
    cmd: blodCommand,
  },
  italic: {
    icon: faItalic,
    cmd: italicCommand,
  },
  code: {
    icon: faCode,
    cmd: codeCommand,
  },
  ul: {
    icon: faListUl,
    cmd: unorderedListCommand,
  },
  ol: {
    icon: faListOl,
    cmd: orderedListCommand,
  },
  link: {
    icon: faLink,
    cmd: linkCommand,
  },
}

const keys = Object.keys(btns)

const Toolbar = ({ showPreview, preview, handleCMD, submit }) => (
  <ButtonGroup className="bg-secondary">
    {keys.map(k => (
      <Button
        disabled={preview}
        key={k}
        onClick={e => {
          if (preview) return
          handleCMD(e, btns[k].cmd)
        }}
      >
        <FontAwesomeIcon icon={btns[k].icon} />
      </Button>
    ))}

    <Button className="submit" onClick={submit}>
      发表
    </Button>
    <Button className="preview" onClick={showPreview}>
      {preview ? '编辑' : '预览'}
    </Button>
  </ButtonGroup>
)

Toolbar.defaultProps = {
  handleCMD: () => '',
  submit: () => '',
}

Toolbar.propTypes = {
  preview: PropTypes.bool.isRequired,
  showPreview: PropTypes.func.isRequired,
  handleCMD: PropTypes.func,
  submit: PropTypes.func,
}

export default Toolbar
