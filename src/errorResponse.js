module.exports = function makeErrorResponse(status, error, fieldErrors = [], message = '') {
  return {
    timestamp: new Date().toISOString(),
    status,
    error,
    fieldErrors,
    message
  };
};
