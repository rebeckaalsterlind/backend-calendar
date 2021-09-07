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
            "id": randomNo
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
              $each: [{"task": req.body.item, "id": randomNo}]
            }
          }
        }
      );

    }

    res.send(test)
  })
})




/************* Json file ***********/




// router.post('/add', function(req, res, next) {

//   let randomNo = Math.floor(10000 + Math.random() * 10000) + 1;

//   fs.readFile("toDo.json", (err, data) => {
//     if(err) console.log('error', err);

//     const arr = JSON.parse(data)
//     const toDo = [...arr]

//     let result = toDo.find(({date}) => date === req.body.date);

//     if(result !== undefined) {
//       result.item.push({
//         "task": req.body.item, 
//         "id": randomNo
//       })
//     } else {
//       toDo.push
//       ({
//         "date": req.body.date, 
//         "item": [{
//           "task": req.body.item, 
//           "id": randomNo
//         }]
//       })
//     }


//     fs.writeFile("toDo.json", JSON.stringify(toDo, null, 2), (err) => {
//       if(err) console.log('error; ', err);
//     })

//     res.json(toDo)

//   });

// });



router.post('/checked', function(req, res, next) {


  fs.readFile("toDo.json", (err, data) => {
    if(err) console.log('error', err);

    const arr = JSON.parse(data)
    const toDo = [...arr]

    let dateOf = toDo.find(({date}) => date === req.body.date);

    let index = dateOf.item.findIndex(item => item.id.toString() === req.body.item);
    dateOf.item.splice(index, 1);

    if(dateOf.item.length <= 0) {

      let i = toDo.findIndex(({date}) => date === req.body.date);
      toDo.splice(i, 1);
    }


    fs.writeFile("toDo.json", JSON.stringify(toDo, null, 2), (err) => {
      if(err) console.log('error; ', err);
    })

    res.json(toDo)

  });

});



module.exports = router;
