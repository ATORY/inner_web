import React from 'react'
import { withRouter } from 'react-router-dom'
import ReactRouterPropTypes from 'react-router-prop-types'
import { Query } from 'react-apollo'

import { PATH_USER_CENTER_IMAGE } from 'utils/constant'
import { GET_FILES } from 'utils/apollo'

import FolderCell from 'components/Cell/FolderCell'
import ImageCell from 'components/Cell/ImageCell'
import Loading from 'components/Loading'

const Container = ({ match, location, history }) => {
  // console.log('match', match)
  // console.log('location', location)
  // const params = new URLSearchParams(location.search)
  const currentPath = location.pathname.replace(PATH_USER_CENTER_IMAGE, '')
  const singleClick = e => {
    e.stopPropagation()
    const items = document.getElementsByClassName('file-item')
    // console.log(items)
    for (let index = 0; index < items.length; index += 1) {
      const element = items[index]
      element.className = 'file-item'
    }

    let current = e.target
    while (current) {
      if (current.getAttribute('role') === 'presentation') {
        break
      }
      current = current.parentElement
    }
    current.className = 'file-item active'
  }

  const folderDoubleClick = filename => {
    history.push(`${match.url}/${filename}`)
  }

  return (
    <Query
      query={GET_FILES}
      variables={{
        parentPath: currentPath,
      }}
    >
      {({ loading, error, data }) => {
        if (loading) return <Loading />
        if (error) return <div>{error.message}</div>
        return data.files.map(file => {
          // console.log('file', file)
          if (file.mimetype === 'folder') {
            return (
              <FolderCell
                key={file.id}
                classes={['file-item']}
                {...file}
                singleClick={singleClick}
                doubleClick={folderDoubleClick}
              />
            )
          }
          return (
            <ImageCell
              key={file.id}
              classes={['file-item']}
              singleClick={singleClick}
              {...file}
            />
          )
        })
        // return <div>ImageContainer</div>
      }}
    </Query>
  )
}

Container.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
}

export default withRouter(Container)

/*
const PEEPS = [
  { id: 0, name: 'Michelle', friends: [1, 2, 3] },
  { id: 1, name: 'Sean', friends: [0, 3] },
  { id: 2, name: 'Kim', friends: [0, 1, 3] },
  { id: 3, name: 'David', friends: [1, 2] },
]

function Person({ match }) {
  return (
    <div>
      <ul>
        {PEEPS.map(item => (
          <li key={item.id}>
            <Link to={`${match.url}/${item.id}`}>{item.name}</Link>
          </li>
        ))}
      </ul>
       <Route path={`${match.url}/:id`} component={Person} />
      </div>
      )
    }
*/
