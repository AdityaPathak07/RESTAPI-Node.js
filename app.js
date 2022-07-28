
require("dotenv").config();
const express = require("express");
const app = express();
const {hashSync, compareSync} = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const Intern = require("./database")

app.use(express.urlencoded({extended:true}));
app.use(passport.initialize());

require("./passport");

app.get("/", function(req,res){
  Intern.find({}, function(err,founditem){
    if(!err)
    res.send(founditem);
    else
    res.send(err)
  })
})

// POST request of "title" to /boards
var i = 0;
app.post("/boards", function(req,res){
    const item = new Intern({
        title: req.body.title,
        id:i++,
        stage:1
    });
        item.save(function(err){
            if(!err)
            res.send("Success");
        })
})

// PUT request of "id" to /boards/:id
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

//Extension of Project 1 AUTHENTICATION
// Register route,send post request of email and password
app.post("/register", function(req,res){
    const users = new Intern({
        email : req.body.email,
        password : hashSync(req.body.password , 10)
    });
       console.log(users.email, users.password);
   
   users.save().then(function(users){
    res.send({
        success : "User is registered",
        message : "Success",
        user : {
            email : users.email,
            id : users._id
        }
    });
   }).catch(function(err){
    res.send({
        success : "User failed to register",
        err0r : err
    })
   })
});

// Login route, send post request of registered email and password
app.post("/login", function(req,res){
    Intern.findOne({email : req.body.email}).then(function(user){
        //No user Found
        if(!user){
           return res.status(401).send({
            message : "No user found",
            success : false
           })
        }
              //Incorrect password
        if(!compareSync(req.body.password , user.password)){
            return res.status(401).send({
                message : "Incorrect Password",
                success : false
            })
        }
        //User Found
         const payload = {user : user.email, id : user._id}
         const token = jwt.sign(payload , process.env.WEB_TOKEN, {expiresIn : '7d'})
         return res.status(200).send({
                 message : "Successfully Logged In",
                 success : true,
                 user : {
                   email : user.email,
                   id : user._id
                 },
                 token : "Bearer " + token
         })
    })

})

//SECRET PAGE, using jwt token from /login route , get the request to /secret route for accessing secret page
app.get("/secret", passport.authenticate("jwt", {session : false}), function(req,res){
    res.status(200).send({
        success : true,
        email : req.user,
    });
})

// FOR DELETING DOCUMENTS
app.delete("/", function(req,res){
    Intern.deleteMany({}, function(err){
        if(!err)
        res.send("Success")
        else
        res.send("Error")
    })
});

app.listen(3000,function(req,res){
    console.log("Started at 3000");
})