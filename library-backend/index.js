require('dotenv').config()
const connectToDatabase = require('./db')
const startServer = require('./server')

const PORT = process.env.PORT || 4000
const MONGODB_URI = process.env.MONGODB_URI

connectToDatabase(MONGODB_URI).then(() => {
  startServer(PORT)
})