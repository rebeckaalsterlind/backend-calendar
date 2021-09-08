var express = require('express');
var router = express.Router();
const cors = require("cors");
router.use(cors());
const fs = require("fs");


/* GET users listing. */

/************ Database ***********/
router.get('/', (req, res, next) => {

  req.app.locals.db.collection("toDo").find().toArray()
  .then(result => {
    
    const toDo = []

    for (let i in result) {
      toDo.push(result[i])
    }

    res.send(toDo)

  });

});


router.post('/add', function(req, res, next) {

  let randomNo = Math.floor(10000 + Math.random() * 10000) + 1;
  let id = randomNo.toString();

  //look for selected date in database
  req.app.locals.db.collection("toDo").find({"date": req.body.date}).toArray()
  .then(result => {

    //if date not found => insert date with toDo
    if(result[0] === undefined){
      const add =  
      {
        "date": req.body.date,
        "item": [
          {
            "task": req.body.item,
            "id": id
          }
        ]
      };

      req.app.locals.db.collection("toDo").insertOne(add);

    //if date allready exists => push toDo to date
    } else {

      req.app.locals.db.collection("toDo").update( 
        {"date": req.body.date},
        {
          $push: {
            item: {
              $each: [{"task": req.body.item, "id": id}]
            }
          }
        }
      );

    }

    res.send("")
  });
});


router.post('/checked', function(req, res, next) {

  req.app.locals.db.collection("toDo").update(
    { },
    { $pull: { item: { task: req.body.item.task , id: req.body.item.id } } },
    { multi: true }
  )
  .then(() => {
    //check if date has any to-dos
    req.app.locals.db.collection("toDo").find({"date": req.body.date}).toArray()
    .then(result => {
      //if not => delete date
      if(result[0].item[0] === undefined) { 
        req.app.locals.db.collection("toDo").deleteOne({"date" : req.body.date})
      }

    });

  });

  res.json("")
   
});
  




module.exports = router;
