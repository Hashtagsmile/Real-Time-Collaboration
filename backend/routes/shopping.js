const express = require('express');
const router = express.Router();
const {
  getItems,
  addItem,
  updateItem,
  deleteItem
} = require('../controllers/shoppingItemController');
console.log('getItems is a:', typeof getItems); // should log: "function"


const authMiddleware = require('../middleware/authMiddleware');

router.get('/:spaceId', authMiddleware, getItems);
router.post('/:spaceId', authMiddleware, addItem);
router.put('/item/:id', authMiddleware, updateItem);
router.delete('/item/:id', authMiddleware, deleteItem);

module.exports = router;
