import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Navbar, Nav, NavItem, Button } from 'reactstrap'
import { Query } from 'react-apollo'

import Layout from 'components/Layout'
import HeaderContainer from 'components/Header/Container'
import { FOCUSES } from 'utils/apollo'
import './index.scss'
import Loading from 'components/Loading'
import { PATH_REMEMBER_PRE } from 'utils/constant'

const Focuser = ({ id, banner, avator, username }) => (
  <Link to={`${PATH_REMEMBER_PRE}/${id}`}>
    <div className="focuser">
      <div
        className="focuser-banner"
        style={{
          backgroundImage: `url('${banner}')`,
        }}
      />
      <div>
        <img src={avator} alt="" />
        <span>{username}</span>
        <Button
          size="sm"
          outline
          color="primary"
          onClick={e => {
            e.stopPropagation()
            e.preventDefault()
          }}
        >
          取消关注
        </Button>
      </div>
      <div className="focuser-aside">
        <div>记录</div>
        <div>记录集</div>
      </div>
    </div>
  </Link>
)

Focuser.defaultProps = {
  banner: '',
  avator: '',
  username: '',
  id: '',
}

Focuser.propTypes = {
  id: PropTypes.string,
  banner: PropTypes.string,
  avator: PropTypes.string,
  username: PropTypes.string,
}

const UserFocus = () => (
  <Layout isUserCenter needAuth>
    <div className="inner-wrapper">
      <HeaderContainer appendClass="inner-focus">
        <Navbar expand="md">
          <Nav navbar>
            <NavItem>我的关注</NavItem>
          </Nav>
          {/* <Collapse navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>RIGTH</NavItem>
            </Nav>
          </Collapse> */}
        </Navbar>
      </HeaderContainer>
      <main className="inner-focus-main">
        <Query query={FOCUSES}>
          {({ loading, error, data }) => {
            if (loading) return <Loading />
            if (error) return <div>error</div>
            const { users } = data
            return users.map(user => <Focuser key={user.id} {...user} />)
          }}
        </Query>
      </main>
    </div>
  </Layout>
)

export default UserFocus
