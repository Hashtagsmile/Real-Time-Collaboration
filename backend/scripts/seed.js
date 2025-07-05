require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Models
const User = require('../models/User');
const Space = require('../models/Space');
const ShoppingItem = require('../models/ShoppingItem');

// Connect to DB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const seed = async () => {
  try {
    // Clear old data
    await User.deleteMany();
    await Space.deleteMany();
    await ShoppingItem.deleteMany();

    // Create User
    const passwordHash = await bcrypt.hash('password123', 10);
    const user = await User.create({
      email: 'demo@example.com',
      password: passwordHash
    });

    // Create Space
    const space = await Space.create({
      name: 'Demo Family Shopping List',
      inviteCode: 'demo1234',
      members: [user._id]
    });

    // Link space to user
    user.spaces = [space._id];
    await user.save();

    // Create Shopping Items
    const items = [
      { name: 'Milk', space: space._id, addedBy: user._id },
      { name: 'Eggs', space: space._id, addedBy: user._id },
      { name: 'Bread', space: space._id, addedBy: user._id }
    ];

    await ShoppingItem.insertMany(items);

    console.log('🌱 Seed complete: Created user, space, and shopping list.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
};

// Run seed
connectDB().then(seed);
