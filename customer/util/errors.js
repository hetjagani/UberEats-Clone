module.exports = {
  notFound: {
    status: 404,
    message: 'requested resource not found',
  },
  unauthorized: {
    status: 401,
    message: 'unauthorized request',
  },
  serverError: {
    status: 500,
    message: 'internal server error',
  },
  badRequest: {
    status: 400,
    message: 'bad request',
  },
};
