export const successResponse = (
  res,
  status = 200,
  message = "",
  data = null
) => {
  return res.status(status).json({
    status: "success",
    message,
    data,
  });
};

export const errorResponse = (res, status = 400, message = "") => {
  return res.status(status).json({
    status: "error",
    message,
  });
};
