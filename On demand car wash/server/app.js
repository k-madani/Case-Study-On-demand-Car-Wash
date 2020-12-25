//import files
const express=require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const cors=require('cors');
const morgan=require('morgan');
const cookieParser=require('cookie-parser');
const flash=require('express-flash');


const router=express.Router();
const appRoutes=require('./app/routes/api');
let port=process.env.PORT || 3000;

//to invoke express 
const app=express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
app.use(cookieParser());
app.use(`/api`,appRoutes);


//connecting to database
mongoose.connect('mongodb://localhost:27017/car-wash',{useNewUrlParser: true, useFindAndModify: false , useUnifiedTopology: true,useCreateIndex: true},(err)=>{
    
    if(err){
        console.log(`Not connected to databse: ${err}`);
    }
    else {
        console.log(`Database connected.`);
    }
});



//starting the server
app.listen(port , function(){
    console.log(`Running on server ${port}.`);

})

module.exports = app;