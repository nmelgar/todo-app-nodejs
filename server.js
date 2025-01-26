// import libraries
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

// create instance of express app
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// connect to mongodb using uri from .env file 
mongoose.connect(process.env.MONGODB_URI);

// schema for items
const itemsSchema = {
  name: String
};

// create mongoose model
const Item = mongoose.model('Item', itemsSchema, 'todo-items');

// handle get request to the root url
app.get('/', async (req, res) => {
  try {
    const foundItems = await Item.find({});
    res.render('list', { newListItems: foundItems });
  } catch (err) {
    console.error(err);
  }
});

// handle post request to add a new item
app.post('/', async (req, res) => {
  const itemName = req.body.newItem;
  const item = new Item({ name: itemName });
  try {
    await item.save();
    res.redirect('/');
  } catch (err) {
    console.error(err);
  }
});

// handle post request to delete an item
app.post('/delete', async (req, res) => {
  const checkedItemId = req.body.checkbox;
  try {
    await Item.findByIdAndDelete(checkedItemId);
    res.redirect('/');
  } catch (err) {
    console.error(err);
  }
});

// start server on port 3000
app.listen(3000, () => {
  console.log('Server started on port 3000');
});