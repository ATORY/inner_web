import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder } from '@fortawesome/free-solid-svg-icons'

import './cell_file_item.scss'

const FolderCell = ({ classes, filename, singleClick, doubleClick }) => (
  <div
    role="presentation"
    className={`cell-file-item ${classes.join(' ')}`}
    onClick={singleClick}
    onDoubleClick={() => {
      doubleClick(filename)
    }}
  >
    <div className="icon">
      <FontAwesomeIcon icon={faFolder} />
    </div>
    <p>{filename}</p>
  </div>
)

FolderCell.defaultProps = {
  singleClick: () => {},
  doubleClick: () => {},
  classes: [],
}

FolderCell.propTypes = {
  filename: PropTypes.string.isRequired,
  singleClick: PropTypes.func,
  doubleClick: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.array,
}

export default FolderCell
