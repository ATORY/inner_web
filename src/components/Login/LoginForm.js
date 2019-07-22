import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import ReactRouterPropTypes from 'react-router-prop-types'
import { Col, Button, Form, FormGroup, Label, Input } from 'reactstrap'

import { Mutation, ApolloConsumer } from 'react-apollo'
// import { client as ApolloClient } from '../../apollo'

import { EVENT_LOGIN, eventEmitter } from 'utils/eventCenter'
import { LOGIN_USER } from 'utils/apollo'

class LoginForm extends React.Component {
  constructor() {
    super()
    this.state = {
      phoneOrEmail: '',
      password: '',
    }
  }

  render() {
    const { phoneOrEmail, password } = this.state
    return (
      <ApolloConsumer>
        {client => (
          <Mutation
            mutation={LOGIN_USER}
            onCompleted={({ token }) => {
              // if (process.env.NODE_ENV === 'development')
              //   localStorage.setItem('token', token)
              client.writeData({
                data: {
                  isLoggedIn: true,
                  token,
                },
              })
              eventEmitter.emit(EVENT_LOGIN)
              const { history, location, toPath } = this.props
              const { from } = location.state
              // console.log('from', from)
              if (toPath) window.location.pathname = toPath
              // history.push(toPath)
              else if (from && from.pathname)
                window.location.pathname = from.pathname
              // history.push(from.pathname)
              else history.goBack()
            }}
          >
            {(login, { loading, error }) => (
              <Form
                onSubmit={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  login({
                    variables: {
                      phoneOrEmail,
                      password,
                    },
                  }).catch(console.error)
                }}
              >
                <FormGroup row>
                  <Label for="exampleEmail" sm={2}>
                    Email
                  </Label>
                  <Col sm={10}>
                    <Input
                      id="exampleEmail"
                      name="phoneOrEmail"
                      value={phoneOrEmail}
                      onChange={e => {
                        this.setState({ phoneOrEmail: e.target.value })
                      }}
                      placeholder="with a placeholder"
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="examplePassword" sm={2}>
                    Password
                  </Label>
                  <Col sm={10}>
                    <Input
                      type="password"
                      name="password"
                      value={password}
                      onChange={e => {
                        this.setState({ password: e.target.value })
                      }}
                      id="examplePassword"
                      placeholder="password placeholder"
                    />
                  </Col>
                </FormGroup>

                {loading ? (
                  <div>Loading</div>
                ) : (
                  <Col sm={{ size: 10, offset: 2 }}>
                    <Button>Submit</Button>
                  </Col>
                )}
                {error && <div>{error.message}</div>}
              </Form>
            )}
          </Mutation>
        )}
      </ApolloConsumer>
    )
  }
}

LoginForm.defaultProps = {
  toPath: '',
}
LoginForm.propTypes = {
  toPath: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
}

export default withRouter(LoginForm)
