const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const fs = require('node:fs')
const path = require('node:path')
const yaml = require('yaml')
const swaggerUi = require('swagger-ui-express')
const healthRouter = require('./routes/health.routes')
const courseTypesRouter = require('./routes/courseTypes.routes')
const universitiesRouter = require('./routes/universities.routes')
const coursesRouter = require('./routes/courses.routes')
const notFound = require('./middlewares/notFound')
const errorHandler = require('./middlewares/errorHandler')

const app = express()
const corsOrigin = process.env.CORS_ORIGIN
const openApiPath = path.join(__dirname, 'docs', 'openapi.yaml')
const openApiYaml = fs.readFileSync(openApiPath, 'utf8')
const openApiDocument = yaml.parse(openApiYaml)

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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument))
app.get('/openapi', (_req, res) => {
  res.type('text/yaml').send(openApiYaml)
})
app.use('/api/v1/course-types', courseTypesRouter)
app.use('/api/v1/universities', universitiesRouter)
app.use('/api/v1/courses', coursesRouter)

// Not Found
app.use(notFound)

// Server Error
app.use(errorHandler)

module.exports = app
