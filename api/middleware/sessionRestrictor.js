
module.exports = function cookieprotected(req, res, next) {
    if (req.session && req.session.userID) {
      next();
    } else {
      res.status(401).json({ message: 'you shall not pass, or my name is not the cookie guard!!!' });
    }
  }
  