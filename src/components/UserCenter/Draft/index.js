import React from 'react'
import { Navbar, Nav, NavItem, Collapse } from 'reactstrap'
import Layout from 'components/Layout'
import HeaderContainer from 'components/Header/Container'

import './index.scss'

const UserDraft = () => (
  <Layout isUserCenter needAuth>
    <div className="inner-wrapper">
      <HeaderContainer appendClass="inner-draft">
        <Navbar expand="md">
          <Nav navbar>
            <NavItem>设置</NavItem>
          </Nav>
          <Collapse navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>RIGTH</NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </HeaderContainer>
      <main className="inner-draft-main">draft</main>
    </div>
  </Layout>
)

export default UserDraft
