const express = require('express');
const router = express.Router();

//import note controller
const noteController = require('../controllers/noteController');

//import routes
router.get('/', noteController.index);
router.post('/', noteController.store);
router.get('/:id', noteController.show);
router.put('/update/:id', noteController.update);
router.delete('/delete/:id', noteController.destroy);

module.exports = router;