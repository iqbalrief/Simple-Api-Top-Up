

const STATUS = {
    SUCCESS: 0,
    VALIDATION_ERROR: 102,
    EMAIL_ALREADY_EXISTS: 103,
    SERVER_ERROR: 500
  };
  

  const sendError = (res, statusCode, message, status = STATUS.SERVER_ERROR) => {
    res.status(statusCode).json({
      status,
      message,
      data: null
    });
  };
  
  const sendSuccess = (res, message, data = null, status = STATUS.SUCCESS) => {
    res.status(200).json({
      status,
      message,
      data
    });
  };
  
  module.exports = { sendError, sendSuccess, STATUS };
  