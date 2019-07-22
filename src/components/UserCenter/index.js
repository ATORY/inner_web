import React from 'react'
import { Route } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import Setting from './Setting'
import Writer from './Writer'
import ImageCenter from './ImageCenter'
import Article from './Article'
import Draft from './Draft'
import Bookmark from './Bookmark'
import Message from './Message'
import Focus from './Focus'
import Plan from './Plan'

import './index.scss'

const UserCenter = ({ match }) => (
  <>
    <Helmet>
      <title>个人中心</title>
    </Helmet>
    <Route path={`${match.path}/focus`} component={Focus} />
    <Route path={`${match.path}/message`} component={Message} />
    <Route path={`${match.path}/bookmark`} component={Bookmark} />
    <Route path={`${match.path}/draft`} component={Draft} />
    {/* <Route path={`${match.path}/writer`} component={Writer} /> */}
    <Route path={`${match.path}/writer/:id`} component={Writer} />
    <Route path={`${match.path}/imagecenter`} component={ImageCenter} />
    <Route path={`${match.path}/article`} component={Article} />
    <Route path={`${match.path}/plan`} component={Plan} />
    <Route exact path={match.path} component={Setting} />
  </>
)

export default UserCenter
