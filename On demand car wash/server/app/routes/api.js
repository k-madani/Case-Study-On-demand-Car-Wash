const express=require('express');
const jwt=require('jsonwebtoken');
const router=express.Router();
const _=require('lodash');
const db=require('../models/db');

const User=require('../models/user');
const Package=require('../models/package');
const Order=require('../models/order');
const Admin = require('../models/admin');
const Washer=require('../models/washer');


/*USER */
//user registration route 
router.post('/register',function(req,res,next){
    let user=new User();
    //assign values from user
    user.name=req.body.name;
    user.email=req.body.email; 
    user.password=req.body.password;
    //save details in db
    user.save((err, doc) => {
        if (!err){
            let payload={subject:doc._id};
            let token=jwt.sign(payload,db.secret);
            res.status(200).send({token});
        }
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email adrress found.']);
            else
                return next(err);
        }
    });
})
//user login route
router.post('/login',function(req,res,next){
    if(!req.body.email){
        res.json({success:false,message:'No email provided!'});
    }
    else{
        if(!req.body.password){
            res.json({success:false,message:'No password provided!'}); 
        }
        else{
            User.findOne({email:req.body.email},function(err,user){
                if(err){
                    res.json({success:false,message:err});
                }
                else if(!user){
                    res.json({success:false,message:'User not found!'});
                }
                else{
                    const valid=user.verifyPassword(req.body.password);
                    if(valid){
                        //creating token
                        const token=jwt.sign({userId:user._id},db.secret)
                        //sending the token 
                        res.json({success:true,message:'Authentication successful!',token: token,user});
                    }
                    else{
                        res.json({success:false,message:'Incorrect password!'});
                    }
                }
            })
        }
    }
});
//user authentication
function verifyToken(req,res,next){
    if(!req.headers.authorization){
        res.status(401).send('Unauthorized request!');
    }
    let token=req.headers.authorization.split(' ')[1];
    if(token===null){
        res.status(401).send('Unauthorized request!');
    }
    let payload = jwt.verify(token,db.secret);
    if(!payload){
        res.status(401).send('Unauthorized request!');
    }
    req.userId=payload.subject
    next()

}

router.get('/allusers',function(req,res,next){
    User.find((err,data)=>{
        if(!err){
          res.json(data);
        }
        else{
          return next(err);
        }
      })
})

router.get('/users/:id',function(req,res,next){
    User.findById(req.params.id,(err,data)=>{
        if(!err){
          res.json(data);
        }
        else{
          return next(err);
        }
      })
})

router.delete('/deleteusers/:id',function(req,res,next){
    User.findByIdAndRemove(req.params.id,(err,data)=>{
        if(!err){
          res.status(200).json({msg:"deleted"});
        }
        else{
          return next(err);
        }
      })
})

/*Washer*/
//washer registration route 
router.post('/washer',function(req,res,next){
    let washer=new Washer();
    //assign values from user
    washer.name=req.body.name;
    washer.email=req.body.email; 
    washer.password=req.body.password;
    washer.phone=req.body.phone;
    washer.address=req.body.address;
    //save details in db
    washer.save((err, doc) => {
        if (!err){
            let payload={subject:doc._id};
            let token=jwt.sign(payload,db.secret);
            res.status(200).send({token});
        }
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email adrress found.']);
            else
                return next(err);
        }
    });
})
//washer login route
router.post('/washerLogin',function(req,res){
    if(!req.body.email){
        res.json({success:false,message:'No email provided!'});
    }
    else{
        if(!req.body.password){
            res.json({success:false,message:'No password provided!'}); 
        }
        else{
            Washer.findOne({email:req.body.email},function(err,washer){
                if(err){
                    res.json({success:false,message:err});
                }
                else if(!washer){
                    res.json({success:false,message:'Washer not found!'});
                }
                else{
                    const valid=washer.verifyPassword(req.body.password);
                    if(valid){
                        //creating token
                        const token=jwt.sign({washerId:washer._id},db.secret)
                        //sending the token 
                        res.json({success:true,message:'Authentication successful!',token: token,washer});
                    }
                    else{
                        res.json({success:false,message:'Incorrect password!'});
                    }
                }
            })
        }
    }
});
//washer authentication
function verifyWasherToken(req,res,next){
    if(!req.headers.authorization){
        res.status(401).send('Unauthorized request!');
    }
    let token=req.headers.authorization.split(' ')[1];
    if(token===null){
        res.status(401).send('Unauthorized request!');
    }
    let payload = jwt.verify(token,db.secret);
    if(!payload){
        res.status(401).send('Unauthorized request!');
    }
    req.washerId=payload.subject
    next()

}

router.get('/allwashers',function(req,res,next){
    Washer.find((err,data)=>{
        if(!err){
          res.json(data);
        }
        else{
          return next(err);
        }
      })
})

router.get('/washer/:id',function(req,res,next){
    Washer.findById(req.params.id,(err,data)=>{
        if(!err){
          res.json(data);
        }
        else{
          return next(err);
        }
      })
})

router.delete('/deletewashers/:id',function(req,res,next){
    Washer.findByIdAndRemove(req.params.id,(err,data)=>{
        if(!err){
          res.status(200).json({msg:"deleted"});
        }
        else{
          return next(err);
        }
      })
})


/*Admin*/
router.post('/admin',function(req,res,next){
    let admin=new Admin();
    //assign values from user
    admin.name=req.body.name;
    admin.email=req.body.email; 
    admin.password=req.body.password;
    //save details in db
    admin.save((err, doc) => {
        if (!err){
            let payload={subject:doc._id};
            let token=jwt.sign(payload,db.secret);
            res.status(200).send({token});
        }
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email adrress found.']);
            else
                return next(err);
        }
    });
})
//Admin login route
router.post('/adminLogin',function(req,res){
    if(!req.body.email){
        res.json({success:false,message:'No email provided!'});
    }
    else{
        if(!req.body.password){
            res.json({success:false,message:'No password provided!'}); 
        }
        else{
            Admin.findOne({email:req.body.email},function(err,admin){
                if(err){
                    res.json({success:false,message:err});
                }
                else if(!admin){
                    res.json({success:false,message:'Admin not found!'});
                }
                else{
                    const valid=admin.verifyAdminPassword(req.body.password);
                    if(valid){
                        //creating token
                        const token=jwt.sign({adminId:admin._id},db.secret)
                        //sending the token 
                        res.json({success:true,message:'Authentication successful!',token: token,admin});
                    }
                    else{
                        res.json({success:false,message:'Incorrect password!'});
                    }
                }
            })
        }
    }
});
//Admin authentication
function verifyadminToken(req,res,next){
    if(!req.headers.authorization){
        res.status(401).send('Unauthorized request!');
    }
    let token=req.headers.authorization.split(' ')[1];
    if(token===null){
        res.status(401).send('Unauthorized request!');
    }
    let payload = jwt.verify(token,db.secret);
    if(!payload){
        res.status(401).send('Unauthorized request!');
    }
    req.adminId=payload.subject
    next()

}

router.get('/admin',function(req,res,next){
    Admin.find((err,data)=>{
        if(!err){
          res.json(data);
        }
        else{
          return next(err);
        }
      })
})

router.delete('/deleteadmin/:id',function(req,res,next){
    Admin.findByIdAndRemove(req.params.id,(err)=>{
        if(!err){
          res.status(200).json({msg:"deleted"});
        }
        else{
          return next(err);
        }
      })
})

router.patch('/updateadmin/:id',function(req,res){
    Admin.findByIdAndUpdate({_id:req.params.id},{$set:req.body})
        .then((data)=>{
            res.status(200).json({msg:'Updated!'});
            Admin.find({_id:req.params.id})
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
