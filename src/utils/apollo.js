/* eslint-disable no-console */
import 'isomorphic-fetch'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { createUploadLink } from 'apollo-upload-client'
import { ApolloLink, split } from 'apollo-link'
import { withClientState } from 'apollo-link-state'
import { setContext } from 'apollo-link-context'
// import { createHttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

import gql from 'graphql-tag'

import { EVENT_LOGIN, eventEmitter } from 'utils/eventCenter'

const isDev = process.env.NODE_ENV === 'development'

export const apolloClient = req => {
  const memCache = process.browser
    ? // eslint-disable-next-line no-underscore-dangle
      new InMemoryCache().restore(window.__APOLLO_STATE__)
    : new InMemoryCache()
  // console.log('authorization', memCache.data.get('ROOT_QUERY'))
  // const cache = new InMemoryCache() // not working
  const stateLink = withClientState({
    cache: memCache,
    defaults: {
      windowScrollY: 0,
      isAsideMini: true,
      isAside: false,
      isLoggedIn: false,
      // token: '',
    },
    typeDefs: gql`
      type Mutation {
        updateAsideStatus(isAside: Boolean!): Boolean
      }
    `,
    resolvers: {
      Query: {
        // isLoggedIn: () => !!localStorage.getItem('token'),
      },
      Mutation: {
        // updateLoginStatus: (_, { isLoggedIn }, { cache }) => {
        //   cache.writeData({ data: { isLoggedIn } })
        //   return isLoggedIn
        // },
        updateAsideStatus: (_, { isAside }, { cache }) => {
          cache.writeData({ data: { isAside } })
          return isAside
        },
        updateAsideMiniStatus: (_, { isAsideMini }, { cache }) => {
          cache.writeData({ data: { isAsideMini } })
          return isAsideMini
        },
      },
    },
  })

  const authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      authorization: `Bearer ${
        process.env.NODE_ENV === 'development' || process.browser
          ? localStorage.getItem('token')
          : req.cookies.token
      }`,
    },
  }))

  // const authWSLink = setContext((_, preCtx) => {
  //   console.log(preCtx)
  //   return {}
  // })
  console.log('process.env.REACT_APP_WS', process.env.REACT_APP_WS)

  const wsLink = process.browser
    ? new WebSocketLink({
        uri:
          process.env.NODE_ENV === 'development'
            ? `ws://127.0.0.1:4000/wsgraphql`
            : `wss://inner.atory.cc/wsgraphql`,
        options: {
          reconnect: true,
          // lazy: true,
          connectionParams: {
            authorization: `Bearer ${
              process.env.NODE_ENV === 'development' || process.browser
                ? localStorage.getItem('token')
                : req.cookies.token
            }`,
          },
        },
      })
    : ''
  if (process.browser) {
    if (isDev) console.log('wsLink...')
    const { subscriptionClient } = wsLink
    // const subscriptionMiddleware = {
    //   applyMiddleware(options, next) {
    //     console.log('applyMiddleware func', options)
    //     // eslint-disable-next-line no-param-reassign
    //     options.connectionParams = { authorization: 'applyMiddleware' }
    //     next()
    //   },
    // }

    // add the middleware to the web socket link via the Subscription Transport client
    // subscriptionClient.use([subscriptionMiddleware])
    // subscriptionClient.use([subscriptionMiddleware])
    subscriptionClient.onConnected(() => {
      if (isDev) console.log('connected')
      // subscriptionClient.send(Date.now())
    })

    subscriptionClient.onReconnecting(() => {
      if (isDev) console.log('connecting...')
    })

    subscriptionClient.onDisconnected(() => {
      if (isDev) console.log('disconnected')
      subscriptionClient.reconnect = false
      // subscriptionClient.close()
    })

    eventEmitter.on(EVENT_LOGIN, () => {
      if (isDev) console.log('login....')
      subscriptionClient.reconnect = true
      subscriptionClient.connect()
    })
  }

  const httpLink = authLink.concat(
    ApolloLink.from([
      stateLink,
      createUploadLink({
        // uri: 'http://test.cc/graphql',
        uri:
          process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:4000/graphql'
            : `https://inner.atory.cc/graphql`,

        credentials: 'same-origin',
        // process.env.NODE_ENV === 'development' ? 'include' : 'same-origin', // include, same-origin
        headers: {
          'x-client-name': process.env.REACT_APP_NAME,
          'x-client-version': process.env.REACT_APP_VERSION,
          authorization: `Bearer ${
            process.env.NODE_ENV === 'development' || process.browser
              ? localStorage.getItem('token')
              : req.cookies.token
          }`,
        },
      }),
    ])
  )

  return new ApolloClient({
    connectToDevTools: process.env.NODE_ENV === 'development',
    ssrMode: !process.browser,
    cache: memCache,
    // link: httpLink,
    link: !process.browser
      ? httpLink
      : split(
          // split based on operation type
          ({ query }) => {
            const { kind, operation } = getMainDefinition(query)
            return (
              kind === 'OperationDefinition' && operation === 'subscription'
            )
          },
          wsLink,
          httpLink
        ),
    defaultOptions: {
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
    },
    // onError: error => {
    //   console.log('-----', error)
    //   throw error
    // },
    // clientState: {

    // },
  })
}
// -----------
export const WINDOW_SCROLL_Y = gql`
  query {
    windowScrollY @client
  }
`
export const IS_LOGGED_IN = gql`
  query {
    isLoggedIn @client
    isAside @client
    isAsideMini @client
  }
`
export const UPDATE_ASIDE_MINI_STATUS = gql`
  mutation UpdateAsideStatus($isAsideMini: Boolean) {
    updateAsideMiniStatus(isAsideMini: $isAsideMini) @client
  }
`

export const SAVE_ARTICLE = gql`
  mutation saveArticle(
    $publish: Boolean!
    $content: String!
    $title: String
    $intro: String
    $categorys: [String]
    $tags: [String]
    $snapImg: String
    $id: String
  ) {
    saveArticle(
      publish: $publish
      content: $content
      title: $title
      categorys: $categorys
      tags: $tags
      intro: $intro
      snapImg: $snapImg
      id: $id
    ) {
      id
    }
  }
`

export const ARTICLES = gql`
  query articles($belong: ID) {
    articles(belong: $belong) {
      hasMore
      articles {
        id
        title
        intro
        snapImg
        tags
        categorys
        publish
        published
        publisher {
          id
          avator
          phone {
            value
          }
          email {
            value
          }
          username
        }
        aside {
          mark
        }
      }
    }
  }
`

export const ARTICLE = gql`
  query($id: String) {
    article(id: $id) {
      id
      snapImg
      title
      categorys
      tags
      intro
      content
      published
      publisher {
        id
        avator
        username
        hasFocus
      }
      aside {
        mark
        thumbsUp
        thumbsUpNum
      }
      comments {
        id
        from {
          id
          username
          avator
        }
        published
        content
      }
    }
  }
`

export const UPLOAD_FILE = gql`
  mutation uploadFile($file: Upload!, $parentPath: String) {
    file: uploadFile(file: $file, parentPath: $parentPath) {
      id
      path
      filename
      mimetype
      uri
    }
  }
`

export const UPLOAD_FILES = gql`
  mutation uploadFiles($files: [Upload!]!, $parentPath: String) {
    files: uploadFiles(files: $files, parentPath: $parentPath) {
      id
      path
      filename
      mimetype
      uri
    }
  }
`

export const CREATE_FOLDER = gql`
  mutation createFolder($parentPath: String, $path: String!, $name: String!) {
    file: createFolder(path: $path, parentPath: $parentPath, name: $name) {
      id
      path
      filename
      mimetype
      uri
    }
  }
`

export const GET_FOLDER_CONTANT = gql`
  query getFloderContant($parentPath: String, $path: String) {
    data: getFloderContant(parentPath: $parentPath, path: $path) {
      id
      path
    }
  }
`

export const GET_FILES = gql`
  query($parentPath: String) {
    files: files(parentPath: $parentPath) {
      id
      path
      filename
      mimetype
      uri
    }
  }
`

export const GET_PROFILE = gql`
  query {
    profile: profile {
      id
      username
      signature
      avator
      banner
      phone {
        value
        checked
      }
      email {
        value
        checked
      }
      lastLogin
    }
  }
`

export const UPDATE_PROFILE = gql`
  mutation updateProfile(
    $username: String
    $signature: String
    $banner: String
    $avator: String
  ) {
    profile: updateProfile(
      username: $username
      signature: $signature
      banner: $banner
      avator: $avator
    ) {
      id
    }
  }
`

export const LOGIN_USER = gql`
  mutation login($phoneOrEmail: String!, $password: String!) {
    token: login(phoneOrEmail: $phoneOrEmail, password: $password)
  }
`

export const LOGOUT_USER = gql`
  mutation logout {
    token: logout
  }
`

export const AUTH_PAYLOD = gql`
  query {
    token
  }
`

export const THUMBSUP_MARK_ARTICLE = gql`
  mutation thumbsUpMarkArticle(
    $id: ID!
    $type: ArticleAsideType!
    $thumbsUp: Boolean
    $mark: Boolean
  ) {
    article: thumbsUpMarkArticle(
      articleId: $id
      type: $type
      thumbsUp: $thumbsUp
      mark: $mark
    ) {
      id
      aside {
        mark
        thumbsUp
        thumbsUpNum
      }
    }
  }
`

export const MARKED_ARTICLES = gql`
  query {
    markedArticles {
      hasMore
      articles {
        id
        snapImg
        title
        categorys
        tags
        intro
        published
        publisher {
          id
          avator
          username
        }
        aside {
          mark
          thumbsUp
          thumbsUpNum
        }
      }
    }
  }
`
export const SUBMIT_COMMENT = gql`
  mutation submitComment(
    $to: ID!
    $refer: ID!
    $parent: ID!
    $parentType: CommentType!
    $content: String!
  ) {
    comment: submitComment(
      to: $to
      refer: $refer
      parent: $parent
      parentType: $parentType
      content: $content
    ) {
      id
      from {
        id
        avator
        username
      }
      # to {
      #   avator
      #   username
      # }
      content
      published
    }
  }
`

export const COMMENTS = gql`
  query($parent: ID) {
    comments(parent: $parent) {
      id
      from {
        id
        avator
        username
      }
      content
      published
    }
  }
`

export const MESSAGE_SUBSCRIPTION = gql`
  subscription onMessageAdded($userId: String!) {
    messageAdded(userId: $userId) {
      id
      from {
        id
        username
      }
      content
      published
    }
  }
`

export const MESSAGE_QUERY = gql`
  query {
    messages {
      id
      from {
        id
        username
      }
      content
      published
    }
  }
`

export const FOCUS_ON = gql`
  mutation focusOn($userId: String!, $add: Boolean!) {
    focusOn(userId: $userId, add: $add)
  }
`

export const FOCUSES = gql`
  query {
    users: focuses {
      id
      banner
      avator
      username
      signature
    }
  }
`

export const MEMBER_PROFILE = gql`
  query($id: String!) {
    member: userProfile(id: $id) {
      id
      banner
      avator
      username
      signature
    }
  }
`
