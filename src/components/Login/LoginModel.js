import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import ReactRouterPropTypes from 'react-router-prop-types'

import LoginForm from './LoginForm'

import './loginModel.scss'

const ModalLogin = ({ history, toPath }) => {
  const back = e => {
    e.stopPropagation()
    history.goBack()
  }

  return (
    <div className="loginModelMask" role="presentation" onClick={back}>
      <div
        // className="modal"
        role="presentation"
        onClick={e => e.stopPropagation()}
        className="modelContainer"
      >
        <LoginForm toPath={toPath} />
        <Button type="button" className="close" onClick={back}>
          <FontAwesomeIcon icon={faTimesCircle} />
        </Button>
      </div>
    </div>
  )
}

ModalLogin.defaultProps = {
  toPath: '',
}
ModalLogin.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  // match: PropTypes.any.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  history: ReactRouterPropTypes.history.isRequired,
  toPath: PropTypes.string,
}

export default ModalLogin
