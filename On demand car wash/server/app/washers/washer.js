const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const { isEmail }=require('validator');

const washerSchema=new mongoose.Schema({
    name:{
        type:String,
        required: 'Name can not be empty.'
    },
    email:{
        type:String,
        required: 'Email id can not be empty.',
        unique:true,
        lowercase:true,
        validate:[isEmail,'Please enter valid Email id.']
    },
    password:{
        type:String,
        required: 'Password can not be empty.',
        minlength: [8,'Password must be 8 or more characters.']
    },
    saltSecret:String,
    phone:{
        type:Number,
        required:true
    },
    address:{
        type:String
    },
    role:{
        type:String,
        default:'washer'
    }
    
});

//event
washerSchema.pre('save',function(next){
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(this.password,salt,(_err,hash)=>{
            this.password=hash;
            this.saltSecret=salt;
            next();
        });
    });
});

washerSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

const Washer=mongoose.model('Washer',washerSchema);
module.exports=Washer;