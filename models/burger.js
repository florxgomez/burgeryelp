const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BurgerSchema = new Schema({
  title: String,
  description: String,
  location: String,
});

module.exports = mongoose.model('Burger', BurgerSchema);