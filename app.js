const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Burger = require('./models/burger');

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

const app = express();

app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/burgers', async (req, res) => {
  const burgers = await Burger.find();
  res.render('burgers/index', { burgers });
});

app.get('/burgers/new', (req, res) => {
  res.render('burgers/new');
});

app.post('/burgers', async (req, res) => {
  const burger = new Burger(req.body.burger);
  await burger.save();
  res.redirect(`/burgers/${burger._id}`);
});

app.get('/burgers/:id', async (req, res) => {
  const burger = await Burger.findById(req.params.id);
  res.render('burgers/show', { burger });
});

app.get('/burgers/:id/edit', async (req, res) => {
  const burger = await Burger.findById(req.params.id);
  res.render('burgers/edit', { burger });
});

app.put('/burgers/:id', async (req, res) => {
  const { id } = req.params;
  const burger = await Burger.findByIdAndUpdate(id, { ...req.body.burger });
  res.redirect(`/burgers/${burger._id}`);
});

app.delete('/burgers/:id', async (req, res) => {
  const { id } = req.params;
  await Burger.findByIdAndDelete(id);
  res.redirect('/burgers');
});

app.listen(3001, () => {
  console.log('Serving on port 3001');
});
