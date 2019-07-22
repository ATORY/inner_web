import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import { Navbar, Nav, NavItem } from 'reactstrap'
import Layout from 'components/Layout'
import HeaderContainer from 'components/Header/Container'

import { MESSAGE_QUERY, MESSAGE_SUBSCRIPTION, GET_PROFILE } from 'utils/apollo'
import './index.scss'

class MessagesPage extends React.Component {
  static propTypes = {
    subscribeToNewMessages: PropTypes.func.isRequired,
    data: PropTypes.shape({
      messages: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          content: PropTypes.string,
        })
      ),
    }).isRequired,
  }

  componentDidMount() {
    const { subscribeToNewMessages } = this.props
    subscribeToNewMessages()
  }

  render() {
    const {
      data: { messages = [] },
    } = this.props
    return (
      <div>
        <span>MessagesPage</span>
        {messages.map(m => (
          <div key={m.id}>{m.content}</div>
        ))}
      </div>
    )
  }
}

const UserMessage = () => (
  <Layout isUserCenter needAuth>
    <div className="inner-wrapper">
      <HeaderContainer appendClass="inner-message">
        <Navbar expand="md">
          <Nav navbar>
            <NavItem>我的消息</NavItem>
          </Nav>
          {/* <Collapse navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>RIGTH</NavItem>
            </Nav>
          </Collapse> */}
        </Navbar>
      </HeaderContainer>
      <Query query={GET_PROFILE}>
        {({ data: { profile } }) => (
          <main className="inner-message-main">
            <Query query={MESSAGE_QUERY}>
              {({ subscribeToMore, ...result }) => (
                <MessagesPage
                  {...result}
                  subscribeToNewMessages={() =>
                    subscribeToMore({
                      document: MESSAGE_SUBSCRIPTION,
                      variables: { userId: profile.id },
                      updateQuery: (prev, { subscriptionData }) => {
                        if (!subscriptionData.data) return prev
                        const newFeedItem = subscriptionData.data.messageAdded

                        return Object.assign({}, prev, {
                          messages: [newFeedItem, ...prev.messages],
                        })
                      },
                    })
                  }
                />
              )}
            </Query>
          </main>
        )}
      </Query>
    </div>
  </Layout>
)

export default UserMessage
