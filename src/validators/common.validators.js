const AppError = require('../errors/AppError')

function toNullableValue(value) {
  return value == null ? null : value
}

function buildDetails(details, fallback, value) {
  if (typeof details === 'function') {
    return details(value)
  }
  if (details == null) {
    return fallback
  }
  return Array.isArray(details) ? details : [details]
}

function toPositiveInt(
  id,
  {
    fieldName = 'id',
    required = true,
    message = 'ID non valido',
    details,
  } = {},
) {
  const payload = { field: fieldName, value: toNullableValue(id) }
  if (id == null || id === '') {
    if (required) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        message,
        buildDetails(details, [payload], id),
      )
    }
    return null
  }

  const numericId = Number(id)
  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw new AppError(
      400,
      'VALIDATION_ERROR',
      message,
      buildDetails(details, [payload], id),
    )
  }

  return numericId
}

function normalizeName(
  name,
  {
    required = false,
    fieldName = 'name',
    requiredMessage = "Il nome e' obbligatorio",
    invalidMessage = 'Nome non valido',
    details,
  } = {},
) {
  const payload = { field: fieldName, value: toNullableValue(name) }
  if (name == null) {
    if (required) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        requiredMessage,
        buildDetails(details, [payload], name),
      )
    }
    return null
  }

  if (typeof name !== 'string') {
    throw new AppError(
      400,
      'VALIDATION_ERROR',
      invalidMessage,
      buildDetails(details, [payload], name),
    )
  }

  const trimmed = name.trim()
  if (!trimmed) {
    throw new AppError(
      400,
      'VALIDATION_ERROR',
      invalidMessage,
      buildDetails(details, [payload], name),
    )
  }

  return trimmed
}

function isProvidedValue(value) {
  if (value == null) {
    return false
  }
  if (typeof value === 'string') {
    return value.trim() !== ''
  }
  return true
}

function requireAtLeastOneField(
  payload,
  fieldsArray,
  { message = "E' necessario fornire almeno un campo", details } = {},
) {
  const fields = Array.isArray(fieldsArray) ? fieldsArray : []
  const hasValue = fields.some((field) =>
    isProvidedValue(payload ? payload[field] : undefined),
  )

  if (!hasValue) {
    throw new AppError(
      400,
      'VALIDATION_ERROR',
      message,
      buildDetails(details, [{ field: fields, value: null }], fields),
    )
  }
}

module.exports = {
  toPositiveInt,
  normalizeName,
  requireAtLeastOneField,
}
