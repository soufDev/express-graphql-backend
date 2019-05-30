import jwt from 'jsonwebtoken';

export default (request, response, next) => {
  const authHeader = request.get('Authorization');
  if (!authHeader) {
    request.isAuth = false
    return next();
  }
  const token = authHeader.split(' ')[1];
  if (!token || token === '') {
    request.isAuth = false;
    return next();
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'supersecretkey');
  } catch (err) {
    request.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    request.isAuth = false;
    return next();
  }
  request.isAuth = true;
  request.userId = decodedToken.userId;
  return next();
}
