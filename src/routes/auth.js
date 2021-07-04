const router = require('express').Router();
const multer = require('../middlewares/multer');

//Load auth controllers
const registerController = require('../controllers/auth/registerController');
const loginController = require('../controllers/auth/loginController');
const emailVerificationController = require('../controllers/auth/emailVerificationController');


// @route POST auth/register
// @desc Register user
router.post('/register', multer.single('photo'), registerController.register);

// @route POST auth/login
// @desc Login with username
router.post('/login/username', loginController.loginWithUsername);
// @desc Login with email
router.post('/login/email', loginController.loginWithEmail);

// @route GET auth/emailVerification
// @desc verify user's email address
router.get('/emailVerification/:id/:token', emailVerificationController.verify);


module.exports = router;