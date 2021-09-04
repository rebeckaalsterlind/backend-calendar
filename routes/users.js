var express = require('express');
var router = express.Router();
const cors = require("cors");
router.use(cors());
const fs = require("fs");

let newToDo;

/* GET users listing. */
router.get('/', function(req, res, next) {

  fs.readFile("toDo.json", (err, data) => {
    if(err) {
      console.log('error', err);      
    }

    const toDo = JSON.parse(data)

    res.send(toDo)
    return 

  })

});


router.post('/', function(req, res, next) {

  fs.readFile("toDo.json", (err, data) => {
    if(err) console.log('error', err);

    const toDo = JSON.parse(data)
    console.log('too', toDo );
    const arr = [...toDo]
    let result = arr.find(({date}) => date === req.body.date);

    if(result !== undefined) {
      result.task.push(req.body.newTask)
      //toDo = result;
    } else {
      toDo.push({"date": req.body.date, "task": [req.body.newTask]})
    }


    fs.writeFile("toDo.json", JSON.stringify(toDo, null, 2), (err) => {
      if(err) console.log('error; ', err);
    })

    res.json(toDo)

  });

});



//should prob be a post
router.get('/add', function(req, res, next) {

  fs.readFile("toDo.json", (err, data) => {
    if(err) console.log('error', err);


    const toDo = JSON.parse(data)

    newToDo =  {"task": "clean", "task": "cook"};

    toDo.push(newToDo);

    fs.writeFile("toDo.json", JSON.stringify(toDo, null, 2), (err) => {
      if(err) console.log('error; ', err);
    })
    res.send(toDo)
    return 

  })

});


router.get('/json', function(req, res, next) {
  fs.readFile("toDo.json", (err, data) => {
    if(err) {
      console.log('error', err);      
    }

    const toDo = JSON.parse(data)

    res.send(toDo)
    return 

  })
  let users = [
    {
      "date": "Wed Sep 29",
      "task": [
        "clean",
        "shop",
        "pay bills"
      ]
    },
    {
     "date": "Thu Sep 30",
     "task": [
       "run",
       "sleep",
       "cook"
     ]
   },
   {
    "date": "Sat Sep 04",
    "task": [
      "eat",
      "dentist",
      "clean"
    ]
  }
   ];
  res.json(users)
//http://localhost:3010/users/json  fetcha address från frontend? 
});


router.post('/json', function(req, res, next) {
  
  fs.readFile("toDo.json", (err, data) => {
    if(err) console.log('error', err);


    const toDo = JSON.parse(data)

    newToDo =  req.body;
    console.log('newToDo', newToDo);
    
    toDo.push(newToDo);

    fs.writeFile("toDo.json", JSON.stringify(toDo, null, 2), (err) => {
      if(err) console.log('error; ', err);
    })

    res.json(toDo)

  });

});


module.exports = router;
