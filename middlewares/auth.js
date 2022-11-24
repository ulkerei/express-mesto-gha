const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw new UnauthorizedError('Необходима авторизация.');
  }
  const token = authorization.replace(/^Bearer*\s*/i, '');
  let payload;
  try {
    payload = jwt.verify(token, '50f9baa64b85bd4b0c60974fd6e5d1c426cd07f7d3de2d5d1665a1aa038ca31e');
    req.user = { _id: payload._id };
    next();
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }
};
