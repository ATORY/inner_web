import React from 'react'
import PropTypes from 'prop-types'

const ArticlesSet = ({ id }) => (
  <div>
    ArticlesSet
    {id}
  </div>
)

ArticlesSet.propTypes = {
  id: PropTypes.string.isRequired,
}

export default ArticlesSet
