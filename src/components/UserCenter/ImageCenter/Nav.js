import React from 'react'
import { faFolderPlus, faFileMedical } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Navbar, Nav, NavItem, Collapse, Button } from 'reactstrap'
import { Link, withRouter } from 'react-router-dom'
import ReactRouterPropTypes from 'react-router-prop-types'

import {
  eventEmitter,
  EVENT_ADD_FOLDER,
  EVENT_ADD_IMAGE,
} from 'utils/eventCenter'

const ImageNav = ({ match, location }) => {
  // console.log('match', match.url)
  // console.log('location', location.pathname)
  const pathTmpArr = location.pathname.replace(match.url, '').split('/')

  const pathArr = pathTmpArr.map((value, index) => {
    const tmp = pathTmpArr.slice(0, index + 1)
    return {
      p: tmp.join('/'),
      v: value || '图库',
    }
  })
  // console.log(pathArr)
  return (
    <Navbar expand="md">
      <Nav navbar>
        {pathArr.map(item => (
          <NavItem key={`${item.p}${item.v}`}>
            <Link to={`${match.path}${item.p}`}>
              <Button>{item.v}</Button>
            </Link>
            <span>/</span>
          </NavItem>
        ))}
      </Nav>

      <Collapse navbar>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <Button
              className="icon-btn"
              onClick={() => eventEmitter.emit(EVENT_ADD_FOLDER)}
            >
              <FontAwesomeIcon icon={faFolderPlus} />
            </Button>
          </NavItem>
          <NavItem>
            <Button
              className="icon-btn"
              onClick={() => eventEmitter.emit(EVENT_ADD_IMAGE)}
            >
              <FontAwesomeIcon icon={faFileMedical} />
            </Button>
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  )
}
ImageNav.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
}

export default withRouter(ImageNav)
