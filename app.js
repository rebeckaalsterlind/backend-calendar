var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var toDoRouter = require('./routes/toDo');

var app = express();

const MongoClient = require("mongodb").MongoClient;

MongoClient.connect("mongodb+srv://alsterlind:8504143201@todo-calendar-react.kcq0f.mongodb.net/toDo-calendar-react?retryWrites=true&w=majority", {
useUnifiedTopology: true
})

.then(client => {

  console.log('Connected to database');
  const db = client.db("toDo-calendar-react");
  app.locals.db = db; 

})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/toDo', toDoRouter);

module.exports = app;
