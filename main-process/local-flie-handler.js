/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
const { ipcMain, dialog } = require('electron')
const os = require('os')
const fs = require('fs')

const {
  LOAD_LOCAL_FILE,
  SELECTED_FILE,
  SAVE_FILE,
  SAVE_FILE_STATUS,
  SAVE_FILE_AS,
} = require('../src/constant-electron')

const homeDir = os.homedir()
// const readFileSync = util.promisify(fs.readFileSync)

class LocalFileHandle {
  constructor() {
    if (!LocalFileHandle.instance) {
      this.filePath = ''
      LocalFileHandle.instance = this
    }

    return LocalFileHandle.instance
  }

  openFile(filePath, cb) {
    this.filePath = filePath
    fs.readFile(filePath, 'utf-8', cb)
  }

  writeFile(data, cb) {
    if (!this.filePath) {
      // create file
      dialog.showSaveDialog(
        {
          title: 'new file',
          filters: [{ name: 'Markdown', extensions: ['md'] }],
        },
        filename => {
          if (!filename) return
          this.filePath = filename
          fs.writeFile(this.filePath, data, cb)
        }
      )
    } else {
      fs.writeFile(this.filePath, data, cb)
    }
  }

  writeFileAs(data, cb) {
    dialog.showSaveDialog(
      {
        title: 'new file',
        filters: [{ name: 'Markdown', extensions: ['md'] }],
      },
      filename => {
        console.log('filename', filename)
        if (!filename) return
        this.filePath = filename
        fs.writeFile(this.filePath, data, cb)
      }
    )
  }
}

const localFileHandler = new LocalFileHandle()

ipcMain.on(LOAD_LOCAL_FILE, event => {
  console.log('LOAD_LOCAL_FILE...')
  // event.sender.send('asynchronous-reply', 'pong')
  dialog.showOpenDialog(
    {
      properties: ['openFile'],
      defaultPath: homeDir,
      filters: [
        {
          name: 'Markdown',
          extensions: 'md',
        },
      ],
    },
    files => {
      console.log(files)
      if (files && files[0]) {
        const file = files[0]
        localFileHandler.openFile(file, (err, data) => {
          if (!err) {
            event.sender.send(SELECTED_FILE, data)
          } else {
            console.error(err)
          }
        })
      }
    }
  )
})

ipcMain.on(SAVE_FILE, (event, data) => {
  // console.log('data', data)
  localFileHandler.writeFile(data, err => {
    if (!err) {
      event.sender.send(SAVE_FILE_STATUS.SUCCESS)
    } else {
      event.sender.send(SAVE_FILE_STATUS.FAIL, err.message)
    }
  })
})

ipcMain.on(SAVE_FILE_AS, (event, data) => {
  localFileHandler.writeFileAs(data, err => {
    if (!err) {
      event.sender.send(SAVE_FILE_STATUS.SUCCESS)
    } else {
      event.sender.send(SAVE_FILE_STATUS.FAIL, err.message)
    }
  })
})
