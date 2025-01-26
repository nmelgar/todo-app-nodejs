const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect(process.env.MONGODB_URI);

const itemsSchema = {
  name: String
};

const Item = mongoose.model('Item', itemsSchema, 'todo-items');

app.get('/', async (req, res) => {
  try {
    const foundItems = await Item.find({});
    res.render('list', { newListItems: foundItems });
  } catch (err) {
    console.error(err);
  }
});

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

app.post('/delete', async (req, res) => {
  const checkedItemId = req.body.checkbox;
  try {
    await Item.findByIdAndDelete(checkedItemId);
    res.redirect('/');
  } catch (err) {
    console.error(err);
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});