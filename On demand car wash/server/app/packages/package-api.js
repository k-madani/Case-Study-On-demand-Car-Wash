const express=require('express');
const jwt=require('jsonwebtoken');
const router=express.Router();
const _=require('lodash');

const Package=require('./package');

/*PACKAGE*/
//get all packages
router.get('/allpackages',function(req,res,next){
    Package.find((err,data)=>{
        if(!err){
          res.json(data);
        }
        else{
          return next(err);
        }
    });
})

//get package by id
router.get('/packages/:id',function(req,res,next){
    Package.findById(req.params.id,(err,data)=>{
        if(!err){
          res.json(data);
        }
        else{
          return next(err);
        }
      })
})

//post new package
router.post('/packages',function(req,res,next){
    let data=new Package();
    //assign values from package
    data.name=req.body.name;
    data.description=req.body.description; 
    data.amount=req.body.amount;
    //save details in db
    data.save((err, doc) => {
        if (!err){
            res.status(200).send(doc);
        }
        else {
            res.send(err);
        }
    });
})

//update a package
router.patch('/updatepackage/:id',function(req,res){
    Package.findByIdAndUpdate({_id:req.params.id},{$set:req.body})
        .then((data)=>{
            res.status(200).json({msg:'Updated!'});
            Package.find({_id:req.params.id})
                .then((data)=>{
                    res.json(data);
                })
                .catch((err)=>{
                    res.json(err);
                })
        })
        .catch((err)=>{
            res.json(err);
        })
})
//delete a package
router.delete('/deletepackage/:id',function(req,res){
    Package.findByIdAndRemove(req.params.id,(err,data)=>{
        if(!err){
          res.status(200).json({msg:"deleted"});
        }
        else{
          return next(err);
        }
    })
})

//return the http request
module.exports=router;