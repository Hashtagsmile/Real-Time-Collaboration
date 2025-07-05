const express = require('express');
const router = express.Router();
const {
  createSpace,
  joinSpace,
  getMySpaces
} = require('../controllers/spaceController');

const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, createSpace);
router.post('/join', authMiddleware, joinSpace);
router.get('/my-spaces', authMiddleware, getMySpaces);

module.exports = router;
