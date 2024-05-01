const express = require('express');
const bookController = require('../controllers/bookController');
const bookInstanceController = require('../controllers/bookInstanceController');
const router = express.Router();

router.get('/', bookController.index);

router.get('/book/create', bookController.createGet);

router.post('/book/create', bookController.createPost);

router.get('/book/:id', bookController.bookDetails);

router.get('/books', bookController.bookList);


router.get('/bookinstances', bookInstanceController.bookInstanceList);

router.get('/bookinstance/:id', bookInstanceController.bookInstanceDetails);


module.exports = router