const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()

const corsOptions = {
  origin: 'http://localhost:3000',
}

app.use(cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const db = require('./models')
const Role = db.role

const HOST = process.env.DB_HOST
const USER = process.env.DB_USER
const PW = process.env.DB_PW
const DB_NAME = process.env.DB_NAME
const PARAMS = process.env.DB_PARAMS

db.mongoose
  .connect(`mongodb+srv://${USER}:${PW}@${HOST}/${DB_NAME}?${PARAMS}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to Mongodb')
    initial()
  })
  .catch((err) => {
    console.error('Mongodb connection error: ', err)
    process.exit()
  })

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: 'user',
      }).save((err) => {
        if (err) {
          console.log('error', err)
        }

        console.log("added 'user' to roles collection")
      })

      new Role({
        name: 'moderator',
      }).save((err) => {
        if (err) {
          console.log('error', err)
        }

        console.log("added 'moderator' to roles collection")
      })

      new Role({
        name: 'admin',
      }).save((err) => {
        if (err) {
          console.log('error', err)
        }

        console.log("added 'admin' to roles collection")
      })
    }
  })
}

// app.use(function (req, res, next) {
//   res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept')
//   next()
// })

// ROUTES
require('./routes/auth.routes')(app)
require('./routes/user.routes')(app)
//require('./routes/user.routes')

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
