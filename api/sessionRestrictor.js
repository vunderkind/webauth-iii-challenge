

module.exports = function cookieprotected(req, res, next) {
    if (req.session && req.session.userID) {
      next();
    } else {
      res.status(401).json({ message: 'you shall not pass!!' });
    }
  }
  