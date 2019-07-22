const net = require('net')

const port = process.env.PORT ? process.env.PORT - 100 : 3000

process.env.ELECTRON_START_URL = `http://localhost:${port}`

const client = new net.Socket()

let startElectron = false

const tryConnection = () =>
  client.connect(
    {
      port,
    },
    () => {
      client.end()
      if (!startElectron) {
        // console.log('start election')
        startElectron = true
        // eslint-disable-next-line global-require
        const { exec } = require('child_process')
        exec('npm run electron', (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`)
            return
          }
          console.log(`stdout: ${stdout}`)
          console.log(`stderr: ${stderr}`)
        })
      }
    }
  )

tryConnection()

client.on('error', () => {
  setTimeout(tryConnection, 10000)
})
