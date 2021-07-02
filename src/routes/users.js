const router = require('express').Router();

//load user profile
const profileController = require('../controllers/auth/profileController');

router.get('/:id', profileController.getUserProfile);

module.exports = router;
