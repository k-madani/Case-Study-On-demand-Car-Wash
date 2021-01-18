const express=require('express');
const jwt=require('jsonwebtoken');
const router=express.Router();
const _=require('lodash');
const db=require('./db');

const Washer=require('./washer');

/*Washer*/
//washer registration route 
router.post('/washer-register',function(req,res,next){
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

//return the http request
module.exports=router;