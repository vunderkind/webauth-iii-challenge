const express = require('express');

const helper = require('./api-helper.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();
const session = require('express-session');
const restricted = require('./middleware/restricted-bcrypt');
const cookieprotected = require('./middleware/sessionRestrictor');
const cookie = require('./cookie');
const secrets = require('../config/secrets');
const jwtrestriction = require('../api/middleware/jwtRestriction.js');

const sessionConfig = cookie;

// configure express-session middleware
router.use(session(sessionConfig));

router.get('/', (req, res) => {
  res.status(200).send('<img src="https://media.giphy.com/media/d3Kq5w84bzlBLVDO/giphy.gif" alt="it\'s alive"/>')
});


//Get a restricted list of users - cookie path
router.get('/users', jwtrestriction, (req, res) => {
  helper.getAllData()
      .then(data => {
      res.send(data)
  });
});
// restricted list of users bcrypt middleware path 
router.get('/api/users', (req, res) => {
  helper.getAllData()
      .then(data => {
      res.send(data)
  });
});


//register to router
router.post('/register', (req, res) => {
const credentials = req.body;
const hash = bcrypt.hashSync(credentials.password, 14);
credentials.password = hash;
  helper.add(credentials)
  .then(() => {
          return res.status(401).json({message:  `New details: ${credentials.username}, posted to the ${credentials.department} department. Have fun on your first day!`})
      });

});

//sign in to router

router.post('/login', (req, res) => {
  const {username, password} = req.body;
  // req.session.userID = username;
  helper.findByUsername(username)
  .then(user => {
  if(!user || !bcrypt.compareSync(password, user.password)) {
      // req.session.user = user;
      return res.status(401).json({error: `Incorrect Creds`})
  } else {
    const token = generateToken(user);
      return res.status(200).json({
        message: `Welcome, ${user.username}! You are in the ${user.department} department`,
        user_token: token,
      })
  }
  })
});

//implementing log out
router.get('/logout', (req, res) => {
  if (req.headers) {
    req.session.destroy(err => {
      if (err) {
        res.send('error logging out');
      } else {
        res.send('good bye!');
      }
    });
  }
});

function generateToken(user) {
  const payload = {
    sub: user.id,
    username: user.username,
    //never pass passwords as this thing ain't encrypted
  };
  const options = {
    expiresIn: '8h',
  }
  return jwt.sign(payload, secrets.jwtsecret, options)
}



module.exports = router;