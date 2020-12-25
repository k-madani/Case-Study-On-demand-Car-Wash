const mongoose=require('mongoose');

const orderSchema=new mongoose.Schema({
    username:{type:String},
    userid:{type:String},
    email:{type:String},
    phone:{type:String},
    location:{type:String},
    washerid:{type:String},
    washername:{type:String},
    washerphone:{type:String},
    package_name:{type:String},
    amount:{type:String},
    status:{type:String},

})

const Order=mongoose.model('Order',orderSchema);
module.exports=Order;