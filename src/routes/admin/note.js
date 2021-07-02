const express = require('express');
const router = express.Router();

//import admin note controller
const noteController = require('../../controllers/admin/noteController');

//import routes
router.get('/', noteController.index);
router.delete('/delete/:id', noteController.destroy);
router.post('/restore/:id', noteController.restore);

module.exports = router;