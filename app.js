const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.use(express.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/KanbanBoard",{
    useUnifiedTopology: true,
        useNewUrlParser: true,
});

const newSchema = {
    "title": String,
    "id": Number,
    "stage": Number
};

const Intern = mongoose.model("Intern", newSchema);

app.get("/", function(req,res){
  Intern.find({}, function(err,founditem){
    if(!err)
    res.send(founditem);
    else
    res.send(err)
  })
})
var i = 0;
app.post("/boards", function(req,res){
    const item = new Intern({
        "title": req.body.title,
        "id":i++,
        "stage":1
    });
        item.save(function(err){
            if(!err)
            res.send("Success");
        })
})

app.put("/boards/:id", function(req,res){
    const updatedStage = Number(req.body.stage);
    console.log(updatedStage);
    if(updatedStage === 1 || updatedStage === 2 || updatedStage === 3){
        Intern.findOneAndUpdate(
            {id: req.params.id},
            {$set: req.body},
            function(err,result){
                if(!err)
                {res.sendStatus(201).send("success")
                }
            }
        )
    }
    else
    res.sendStatus(400);
})
app.listen(3000,function(req,res){
    console.log("Started at 3000");
})