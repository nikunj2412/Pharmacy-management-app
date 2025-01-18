function sendResponse(req, res, next) {
  const response = res.send;
  res.send = function (originalData) {
    if (originalData.error) {
      arguments[0] = {
        status: 'Failure',
        code: originalData.code,
        message: originalData.message,
        stack: originalData.stack,
      };
    } else if (originalData.results) {
      arguments[0] = { status: 'Success', data: originalData.results };
    }
    response.apply(res, arguments);
  };
  next();
}
module.exports = sendResponse;
