function isDuplicateError(err) {
  return err && (err.code === 'ER_DUP_ENTRY' || err.errno === 1062)
}

function isFkRestrictError(err) {
  return err && (err.code === 'ER_ROW_IS_REFERENCED_2' || err.errno === 1451)
}

function isFkNotFoundError(err) {
  return err && (err.code === 'ER_NO_REFERENCED_ROW_2' || err.errno === 1452)
}

module.exports = {
  isDuplicateError,
  isFkRestrictError,
  isFkNotFoundError,
}
