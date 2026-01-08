const AppError = require("../errors/AppError");

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const isAppError = err instanceof AppError;
  const status = isAppError ? err.status : 500;
  const code = isAppError ? err.code : "INTERNAL_ERROR";
  const message = isAppError ? err.message : "Errore interno del server";
  const details = isAppError ? err.details : [];

  res.status(status).json({
    error: {
      code,
      message,
      details,
    },
  });
}

module.exports = errorHandler;
