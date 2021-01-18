const express=require('express');
const jwt=require('jsonwebtoken');
const router=express.Router();
const _=require('lodash');

const Order=require('./order');

/*ORDERS*/
router.get('/allorders',function(req,res){
    Order.find((err,data)=>{
        if(!err){
          res.json(data);
        }
        else{
          return next(err);
        }
    });
})

router.post('/order',function(req,res){
    let order=new Order;
    order.username=req.body.username;
    order.userid=req.body.userid;
    order.email=req.body.email; 
    order.phone=req.body.phone;
    order.location=req.body.location;
    order.package_name=req.body.package_name;
    order.amount=req.body.amount;
    order.status=req.body.status;
    //save details in db
    order.save((err, doc) => {
        if (!err){
            res.send(doc);
        }
        else {
            res.send(err);
        }
    });

})

router.patch('/updateorder/:id',function(req,res){
    Order.findByIdAndUpdate({_id:req.params.id},{$set:req.body})
        .then((data)=>{
            res.status(200).json({msg:'Updated!'});
            Order.find({_id:req.params.id})
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

router.delete('/deleteorder/:id',function(req,res){
    Order.findByIdAndRemove(req.params.id,(err,data)=>{
        if(!err){
          res.status(200).json({msg:"deleted",data});
        }
        else{
          return next(err);
        }
    })
});

router.get('/getorder/:id',function(req,res,next){
    Order.findById(req.params.id,(err,data)=>{
        if(!err){
          res.json(data);
        }
        else{
          return next(err);
        }
      })
})


//return the http request
module.exports=router;