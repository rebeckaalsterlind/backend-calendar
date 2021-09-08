var express = require('express');
var router = express.Router();
const cors = require("cors");
router.use(cors());
const fs = require("fs");

//PROBLEM WITH PARSE IN GET! 

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
            "id": randomNo.toString()
          }
        ]
      }

    req.app.locals.db.collection("toDo").insertOne(add);
    
    //if date allready exists => push toDo to date
    } else {

      req.app.locals.db.collection("toDo").update( 
        {"date": req.body.date},
        {
          $push: {
            item: {
              $each: [{"task": req.body.item, "id": randomNo.toString()}]
            }
          }
        }
      );

    }

    res.send(test)
  })
})


router.post('/checked', function(req, res, next) {


  req.app.locals.db.collection("toDo").update(
    { },
    { $pull: { item: { task: req.body.item.task , id: req.body.item.id } } },
    { multi: true }
  )
  .then(result => {
    console.log('result', result);
  })

  //find item empty and deleteOne

    res.json("toDo")
})
  


  // req.app.locals.db.collection("toDo").updateOne( { "item": { "task": "första på 16", "id": req.body.item} } )
 

module.exports = router;
