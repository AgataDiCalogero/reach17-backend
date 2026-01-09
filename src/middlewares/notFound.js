const AppError = require('../errors/AppError')

function notFound(req, _res, next) {
  const details = [{ path: req.originalUrl, method: req.method }]
  next(new AppError(404, 'NOT_FOUND', 'Risorsa non trovata', details))
}

module.exports = notFound
