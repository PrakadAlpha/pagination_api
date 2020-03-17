const express = require('express');
const User = require('./Users');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/pagination', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

db.once('open', async () => {

  if(await User.countDocuments().exec() > 0) return;

     Promise.all([
      User.create({user: 'user 1'}),
      User.create({user: 'user 2'}),
      User.create({user: 'user 3'}),
      User.create({user: 'user 4'}),
      User.create({user: 'user 5'}),
      User.create({user: 'user 6'}),
      User.create({user: 'user 7'}),
      User.create({user: 'user 8'}),
      User.create({user: 'user 9'}),
      User.create({user: 'user 10'}),
      User.create({user: 'user 11'}),
      User.create({user: 'user 12'}),
      User.create({user: 'user 13'}),
    ]).then(() => console.log('Added users'));
});

const app = express();

app.use(express.json()); 

app.get('/users', pagination(User) ,(req, res) => {
  
  res.json(res.pages);
});


function pagination(model){
  return async (req, res, next) => {


  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const startIdx = (page-1)*limit;
  const endIdx = page*limit;

  const results = {};

  if(endIdx < await model.countDocuments().exec()){
    results.next = {
      page: page + 1,
      limit: limit
    }
  }

  if(startIdx > 0){
    results.previous = {
      page: page - 1,
      limit: limit
    }
  }

  try {
    results.result = await model.find().limit(limit).skip(startIdx);
    res.pages = results;
    next();
  } catch (error) {
    res.status(500).json({message: error.message});
  }


  res.pages = results;

  next();

  }
}

app.listen(3000, () => console.log('Listening..'));