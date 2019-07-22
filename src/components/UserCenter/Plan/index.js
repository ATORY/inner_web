import React from 'react'
import { Navbar, Nav, NavItem } from 'reactstrap'
import Layout from 'components/Layout'
import HeaderContainer from 'components/Header/Container'

import './index.scss'

const UserPlan = () => (
  <Layout isUserCenter needAuth>
    <div className="inner-wrapper">
      <HeaderContainer appendClass="inner-plan">
        <Navbar expand="md">
          <Nav navbar>
            <NavItem>我的Flag</NavItem>
          </Nav>
          {/* <Collapse navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>RIGTH</NavItem>
            </Nav>
          </Collapse> */}
        </Navbar>
      </HeaderContainer>
    </div>
  </Layout>
)

export default UserPlan
