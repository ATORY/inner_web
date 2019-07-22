import React from 'react'
import PropTypes from 'prop-types'

import './cell_file_item.scss'

const ImageCell = ({ classes, uri, filename, singleClick }) => (
  <div
    className={`cell-file-item ${classes.join(' ')}`}
    role="presentation"
    onClick={e => singleClick(e, { uri })}
  >
    <div className="image">
      <img alt="img" src={uri} />
    </div>
    <p>{filename}</p>
  </div>
)

ImageCell.defaultProps = {
  singleClick: () => {},
  classes: [],
}

ImageCell.propTypes = {
  uri: PropTypes.string.isRequired,
  filename: PropTypes.string.isRequired,
  singleClick: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.array,
}

export default ImageCell
