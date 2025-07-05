const ShoppingItem = require('../models/ShoppingItem');

const getItems = async (req, res) => {
  const { spaceId } = req.params;
  const items = await ShoppingItem.find({ space: spaceId });
  res.json(items);
};

const addItem = async (req, res) => {
  const { spaceId } = req.params;
  const { name } = req.body;

  const item = await ShoppingItem.create({
    name,
    space: spaceId,
    addedBy: req.user.id
  });

  res.status(201).json(item);
};

const updateItem = async (req, res) => {
  const { id } = req.params;
  const { isChecked } = req.body;

  const item = await ShoppingItem.findByIdAndUpdate(id, { isChecked }, { new: true });
  res.json(item);
};

const deleteItem = async (req, res) => {
  const { id } = req.params;

  await ShoppingItem.findByIdAndDelete(id);
  res.json({ message: 'Deleted' });
};

module.exports = {
    getItems,
    addItem,
    updateItem,
    deleteItem
  };
  console.log('getItems is a:', typeof getItems); // should log: "function"
  