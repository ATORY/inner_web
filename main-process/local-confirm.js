/* eslint-disable import/no-extraneous-dependencies */
const { ipcMain, dialog } = require('electron')
const {
  OPEN_INFOMATION_DIALOG,
  CONFIRM_INFOMATION_DIALOG,
} = require('../src/constant-electron')

ipcMain.on(OPEN_INFOMATION_DIALOG, (event, message) => {
  const options = {
    type: 'info',
    title: 'Information',
    message,
    buttons: ['Yes', 'No'],
  }
  dialog.showMessageBox(options, index => {
    event.sender.send(CONFIRM_INFOMATION_DIALOG, index)
  })
})
