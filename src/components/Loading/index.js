import React from 'react'
import PropTypes from 'prop-types'

import './index.scss'

const Loading = ({ message }) => (
  <div className="loading">
    <div className="lds-ring">
      <div />
      <div />
      <div />
      <div />
    </div>
    <div>{message && '加载中...'}</div>
  </div>
)

Loading.defaultProps = {
  message: '',
}

Loading.propTypes = {
  message: PropTypes.string,
}

export default Loading
