import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router-dom'
import Loadable from 'react-loadable'

import { Login, LoginModel } from 'components/Login'

import Loading from 'components/Loading'
import {
  PATH_PAGE,
  PATH_INDEX,
  PATH_USER_CENTER,
  PATH_LOGIN,
  PATH_ARTICLE,
  PATH_REMEMBER,
} from 'utils/constant'

import Home from 'components/Home'
import Article from 'components/Article'
import Remember from 'components/Remember'

const Page = Loadable({
  loader: () => import('components/Page'),
  loading: Loading,
})

const UserCenter = Loadable({
  loader: () => import('components/UserCenter'),
  loading: Loading,
})

export default class Routes extends React.Component {
  // We can pass a location to <Switch/> that will tell it to
  // ignore the router's current location and use the location
  // prop instead.
  //
  // We can also use "location state" to tell the app the user
  // wants to go to `/img/2` in a modal, rather than as the
  // main page, keeping the gallery visible behind it.
  //
  // Normally, `/img/2` wouldn't match the gallery at `/`.
  // So, to get both screens to render, we can save the old
  // location and pass it to Switch, so it will think the location
  // is still `/` even though its `/img/2`.
  constructor(props) {
    super(props)
    this.previousLocation = props.location
  }

  componentWillUpdate(nextProps) {
    const { location } = this.props

    // set previousLocation if props.location is not modal
    if (
      nextProps.history.action !== 'POP' &&
      (!location.state || !location.state.modal)
    ) {
      this.previousLocation = location
    }
  }

  render() {
    const { location } = this.props
    const toPath = location.state && location.state.toPath
    const isModal = !!(
      location.state &&
      location.state.modal &&
      this.previousLocation !== location
    ) // not initial render

    return (
      <>
        <Switch location={isModal ? this.previousLocation : location}>
          <Route exact path={PATH_INDEX} component={Home} />
          <Route path={PATH_PAGE} component={Page} />
          <Route path={PATH_ARTICLE} component={Article} />
          <Route path={PATH_REMEMBER} component={Remember} />
          {/* <Route path="/write/:id" component={Writer} /> */}
          <Route path={PATH_LOGIN} component={Login} />
          <Route path={PATH_USER_CENTER} component={UserCenter} />
        </Switch>
        {isModal ? (
          <Route
            path={PATH_LOGIN}
            render={props => <LoginModel {...props} toPath={toPath} />}
          />
        ) : null}
      </>
    )
  }
}

Routes.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  location: PropTypes.any.isRequired,
}
