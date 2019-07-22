import React from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'

import { PATH_REMEMBER_PRE } from 'utils/constant'
import Viewer from 'components/UserCenter/Writer/Viewer'

const Item = ({ comment, thumbsUp, showModal, inModal }) => (
  <div key={comment.id} className="comment-item">
    <div className="comment-user">
      <img alt="avator" src={comment.from.avator} />
      <Link to={`${PATH_REMEMBER_PRE}/${comment.from.id}`}>
        <div>
          <div>{comment.from.username}</div>
          <span className="time">{moment(comment.published).fromNow()}</span>
        </div>
      </Link>
    </div>
    <Viewer mdStr={comment.content} />
    {!inModal && (
      <div className="item-aside">
        <Button outline size="sm">
          <FontAwesomeIcon icon={faThumbsUp} onClick={thumbsUp} />
          <span>(5)</span>
        </Button>
        <Button outline size="sm" onClick={showModal}>
          回复
          <span>(2)</span>
        </Button>
      </div>
    )}
  </div>
)

Item.defaultProps = {
  showModal: () => '',
  thumbsUp: () => '',
  inModal: false,
}

Item.propTypes = {
  inModal: PropTypes.bool,
  showModal: PropTypes.func,
  thumbsUp: PropTypes.func,
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
}

export default Item
