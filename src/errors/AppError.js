class AppError extends Error {
  constructor(
    status = 500,
    code = "INTERNAL_ERROR",
    message = "Errore interno del server",
    details = [],
  ) {
    super(message);
    this.name = "AppError";
    this.status = Number.isInteger(status) ? status : 500;
    this.code = typeof code === "string" && code ? code : "INTERNAL_ERROR";
    this.details = Array.isArray(details)
      ? details
      : details == null
        ? []
        : [details];

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

module.exports = AppError;
