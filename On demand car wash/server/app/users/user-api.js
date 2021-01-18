const express=require('express');
const jwt=require('jsonwebtoken');
const router=express.Router();
const _=require('lodash');
const db=require('./db');

const User=require('./user-model');

/*USER */
//user registration route 
router.post('/user-register',function(req,res,next){
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

//return the http request
module.exports=router;