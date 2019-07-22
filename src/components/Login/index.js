import React from 'react'
// import ReactRouterPropTypes from 'react-router-prop-types'

import LoginForm from './LoginForm'

import './index.scss'

export { default as LoginModel } from './LoginModel'

export const Login = () => (
  <div className="loginContainer">
    <div>
      <LoginForm />
    </div>
  </div>
)
