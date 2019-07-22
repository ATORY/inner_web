import React from 'react'
import PropTypes from 'prop-types'

// import Loadable from 'react-loadable'

// import Loading from 'components/Loading'

import md from './utils/mdParser'

const Viewer = ({ mdStr = '', aritcleRef }) => (
  <article
    ref={aritcleRef}
    className="container markdown-body"
    // eslint-disable-next-line react/no-danger
    dangerouslySetInnerHTML={{ __html: md.render(mdStr) }}
  />
)

Viewer.defaultProps = {
  mdStr: '',
  aritcleRef: () => '',
}

Viewer.propTypes = {
  mdStr: PropTypes.string,
  aritcleRef: PropTypes.func,
}

export default Viewer
