const mongoose = require('mongoose');
const Burger = require('../models/burger');
const cities = require('./cities');
const burgersNames = require('./burgersNames');

mongoose.connect('mongodb://localhost:27017/burger-yelp', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const seedDB = async () => {
  await Burger.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const burger = new Burger({
      title: `${burgersNames[i]}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
    });
    await burger.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
