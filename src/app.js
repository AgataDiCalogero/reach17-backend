const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const healthRouter = require('./routes/health.routes')
const courseTypesRouter = require('./routes/courseTypes.routes')
const universitiesRouter = require('./routes/universities.routes')
const coursesRouter = require('./routes/courses.routes')
const notFound = require('./middlewares/notFound')
const errorHandler = require('./middlewares/errorHandler')

const app = express()
const corsOrigin = process.env.CORS_ORIGIN

// Security: disable Express signature header
app.disable('x-powered-by')

// Parsing JSON
app.use(express.json({ limit: '1mb' }))
app.use(helmet())
if (process.env.NODE_ENV === 'production') {
  let allowedOrigins = []
  if (corsOrigin) {
    allowedOrigins = corsOrigin
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean)
  }
  app.use(
    cors({
      origin: allowedOrigins.length > 0 ? allowedOrigins : false,
    }),
  )
} else {
  app.use(cors())
}
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

// Routes
app.use('/health', healthRouter)
app.use('/api/v1/course-types', courseTypesRouter)
app.use('/api/v1/universities', universitiesRouter)
app.use('/api/v1/courses', coursesRouter)

// Not Found
app.use(notFound)

// Server Error
app.use(errorHandler)

module.exports = app
