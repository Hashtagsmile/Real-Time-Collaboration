const Space = require('../models/Space');
const User = require('../models/User');
const { nanoid } = require('nanoid/non-secure');

const createSpace = async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;

  try {
    const inviteCode = nanoid(8);
    const space = await Space.create({ name, inviteCode, members: [userId] });

    await User.findByIdAndUpdate(userId, { $push: { spaces: space._id } });
    res.json(space);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const joinSpace = async (req, res) => {
  const { inviteCode } = req.body;
  const userId = req.user.id;

  try {
    const space = await Space.findOne({ inviteCode });
    if (!space) return res.status(404).json({ message: 'Invalid code' });

    if (!space.members.includes(userId)) {
      space.members.push(userId);
      await space.save();
      await User.findByIdAndUpdate(userId, { $push: { spaces: space._id } });
    }

    res.json(space);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMySpaces = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('spaces');
    res.json(user.spaces);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createSpace, joinSpace, getMySpaces };