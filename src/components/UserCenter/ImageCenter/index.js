import React from 'react'
import { Route } from 'react-router-dom'
import ReactRouterPropTypes from 'react-router-prop-types'
import Layout from 'components/Layout'
import HeaderContainer from 'components/Header/Container'

import ImageNav from './Nav'
import AddFolder from './AddFolder'
import AddImage from './AddImage'
import Container from './Container'

import './index.scss'

const ImageCenter = ({ match, location }) => {
  // console.log(match, location)
  const currentPath = location.pathname.replace(match.url, '')
  return (
    <Layout isUserCenter needAuth>
      <div
        className="inner-wrapper"
        role="presentation"
        onClick={() => {
          const items = document.getElementsByClassName('file-item')
          for (let index = 0; index < items.length; index += 1) {
            const element = items[index]
            element.className = 'file-item'
          }
        }}
      >
        <AddFolder parentPath={currentPath} />
        <AddImage parentPath={currentPath} />
        <HeaderContainer appendClass="inner-imagecenter">
          <ImageNav />
        </HeaderContainer>
        <main className="inner-imagecenter-main">
          <Route exact path={match.path} component={Container} />
          <Route path={`${match.path}/*`} component={Container} />
        </main>
      </div>
    </Layout>
  )
}

ImageCenter.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
}

export default ImageCenter
