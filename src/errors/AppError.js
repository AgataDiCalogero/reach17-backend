class AppError extends Error {
  constructor(
    status = 500,
    code = 'INTERNAL_ERROR',
    message = 'Errore interno del server',
    details = [],
  ) {
    super(message)
    this.name = 'AppError'
    this.status = Number.isInteger(status) ? status : 500
    this.code = typeof code === 'string' && code ? code : 'INTERNAL_ERROR'
    if (Array.isArray(details)) {
      this.details = details
    } else if (details == null) {
      this.details = []
    } else {
      this.details = [details]
    }

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError)
    }
  }
}

module.exports = AppError
