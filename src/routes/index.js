const express = require('express');
const router = express.Router();
const authJWT = require('../middlewares/authJWT');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

//Import routes
const auth = require('./auth');
const profile = require('./users');
const note = require('./note');
const adminNote = require('./admin/note');

//load middlewares
const middleware = [
  authJWT.verifyToken,
  authJWT.isAdmin
];

//Route using
router.use('/auth', auth);
router.use('/profile', middleware[0], profile);
router.use('/note', middleware[0], note);
router.use('/admin/note', middleware, adminNote);

module.exports = router;
