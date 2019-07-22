import React from 'react'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEdit,
  faBookmark as solidBookmark,
} from '@fortawesome/free-solid-svg-icons'
import { faBookmark as regularBookmark } from '@fortawesome/free-regular-svg-icons'
import ReactRouterPropTypes from 'react-router-prop-types'

import { PATH_USER_CENTER_WRITER, PATH_ARTICLE_PRE } from 'utils/constant'

import './index.scss'

const ArticleCard = ({
  id,
  title,
  snapImg,
  intro,
  tags,
  categorys,
  publish,
  published,
  publisher,
  aside: { mark },
  editable,
  history,
}) => (
  <section className="article-card">
    <Link to={`${PATH_ARTICLE_PRE}/${id}`}>
      <div
        className="image"
        style={{
          backgroundImage: `url('${snapImg}')`,
        }}
      />
      <div className="intro">
        <h3>{title}</h3>
        <div className="ct">
          {categorys.map(c => (
            <span className="category" key={c}>
              {c}
            </span>
          ))}
          {tags.map(t => (
            <span className="tag" key={t}>
              {t}
            </span>
          ))}
        </div>
        <p>{intro}</p>
      </div>
      {!publish && (
        <div className="article-draft">
          <span>草稿</span>
        </div>
      )}
      {editable ? (
        <div
          role="presentation"
          className="editable"
          onClick={e => {
            e.stopPropagation()
            e.preventDefault()
            history.push(`${PATH_USER_CENTER_WRITER}/${id}`)
          }}
        >
          <FontAwesomeIcon icon={faEdit} />
          <span>编辑</span>
        </div>
      ) : (
        <div className="publisher">
          <img alt="avator" src={publisher.avator} />
          <div>
            <div>
              <span>{publisher.username}</span>
              <span className="time">{moment(published).fromNow()}</span>
            </div>
            <div
              className="mark"
              role="presentation"
              onClick={e => {
                e.stopPropagation()
                e.preventDefault()
              }}
            >
              <FontAwesomeIcon icon={mark ? solidBookmark : regularBookmark} />
            </div>
          </div>
        </div>
      )}
    </Link>
  </section>
)

ArticleCard.defaultProps = {
  intro: '',
  publisher: {
    avator: '',
  },
  tags: [],
  categorys: [],
  snapImg: '',
  publish: true,
  published: '',
  editable: false,
  aside: {
    mark: false,
  },
}

ArticleCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  intro: PropTypes.string,
  snapImg: PropTypes.string,
  publish: PropTypes.bool,
  published: PropTypes.string,
  publisher: PropTypes.shape({
    nickname: PropTypes.string,
    avator: PropTypes.string,
  }),
  aside: PropTypes.shape({
    mark: PropTypes.bool,
  }),
  tags: PropTypes.arrayOf(PropTypes.string),
  categorys: PropTypes.arrayOf(PropTypes.string),
  editable: PropTypes.bool,
  history: ReactRouterPropTypes.history.isRequired,
}

export default withRouter(ArticleCard)
