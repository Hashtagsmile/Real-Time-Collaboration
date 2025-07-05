const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/shopping', require('./shopping'));
router.use('/space', require('./space'));

module.exports = router;
