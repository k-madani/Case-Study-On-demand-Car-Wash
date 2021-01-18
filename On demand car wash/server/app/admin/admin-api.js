const express=require('express');
const jwt=require('jsonwebtoken');
const router=express.Router();
const _=require('lodash');
const db=require('./db');

const Admin = require('./admin');


/*Admin*/
router.post('/admin-register',function(req,res,next){
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

//return the http request
module.exports=router;