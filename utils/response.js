exports.responseSuccessWithData = (data) => ({ message: data });
exports.responseErrorWithData = (data) => ({ message: data });
exports.responseSuccessWithMessage = (
  message = "Yeyy... Request Send With Successfully"
) => ({
  message: message,
});
exports.responseErrorWithMessage = (
  message = "Upsss... Something went wrong on server"
) => ({
  message: message,
});
