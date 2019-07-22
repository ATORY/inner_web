import React from 'react'
import { Navbar, Nav, NavItem } from 'reactstrap'
import Layout from 'components/Layout'
import HeaderContainer from 'components/Header/Container'
import { Query } from 'react-apollo'

import { GET_PROFILE } from 'utils/apollo'
import Loading from 'components/Loading'

import Profile from './Profile'
import System from './System'
import './index.scss'

const UserSetting = () => (
  <Layout isUserCenter needAuth>
    <div className="inner-wrapper">
      <HeaderContainer appendClass="inner-setting">
        <Navbar expand="md">
          <Nav navbar>
            <NavItem>我的设置</NavItem>
          </Nav>
          {/* <Collapse navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>RIGTH</NavItem>
            </Nav>
          </Collapse> */}
        </Navbar>
      </HeaderContainer>
      <main className="inner-setting-main">
        <Query query={GET_PROFILE}>
          {({ loading, error, data }) => {
            if (loading) return <Loading />
            if (error) return <div>Error</div>
            return <Profile {...data.profile} />
          }}
        </Query>
        <System />
      </main>
    </div>
  </Layout>
)

export default UserSetting
