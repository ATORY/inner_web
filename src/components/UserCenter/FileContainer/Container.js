import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import { Button } from 'reactstrap'

import { GET_FILES } from 'utils/apollo'
import FolderCell from 'components/Cell/FolderCell'
import ImageCell from 'components/Cell/ImageCell'
import Loading from 'components/Loading'

export default class FileContainer extends React.Component {
  static defaultProps = {
    backImageValue: () => {},
    value: '',
  }

  static propTypes = {
    backImageValue: PropTypes.func,
    value: PropTypes.string,
  }

  constructor(props) {
    super(props)
    this.state = {
      folderPath: '图库',
      uri: props.value,
    }
    this.folderPathArr = []
  }

  selectFolderPath = (pathname, index) => {
    this.folderPathArr.splice(index + 1)
    const folderPath = this.folderPathArr.join('/')
    this.setState({
      folderPath,
    })
  }

  appendFolderPath = folder => {
    this.folderPathArr.push(folder)
    const folderPath = this.folderPathArr.join('/')
    this.setState({
      folderPath,
    })
  }

  selectImage = (e, { uri }) => {
    const { backImageValue } = this.props
    this.setState({
      uri,
    })
    backImageValue(uri)
  }

  render() {
    // const { value } = this.props
    const { folderPath, uri } = this.state
    this.folderPathArr = folderPath.split('/')
    const searchPath = folderPath.replace('图库', '')
    return (
      <>
        <input
          type="text"
          value={uri}
          placeholder="图片地址"
          onChange={e => this.selectImage(e, { uri: e.target.value })}
        />
        <div className="file-container">
          <Query
            query={GET_FILES}
            variables={{
              parentPath: searchPath,
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
                      doubleClick={() => this.appendFolderPath(file.filename)}
                      {...file}
                    />
                  )
                }
                const select = file.uri === uri ? 'select' : ''
                return (
                  <ImageCell
                    classes={[select]}
                    key={file.id}
                    singleClick={this.selectImage}
                    {...file}
                  />
                )
              })
            }}
          </Query>
        </div>
        <div className="modal-path">
          {this.folderPathArr.map((path, index) => (
            <span key={path}>
              <Button
                size="sm"
                onClick={() => this.selectFolderPath(path, index)}
              >
                {path}
              </Button>
              {index + 1 !== this.folderPathArr.length && <span>/</span>}
            </span>
          ))}
        </div>
      </>
    )
  }
}
