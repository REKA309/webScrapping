const mongoose=require('mongoose');
const productSchema=mongoose.Schema({
    link:{type:String,required:true},
    title:{type:String,required:true},
    rating:{type:String,required:true},
    price:{type:String,required:true},
})
module.exports=mongoose.model("Products",productSchema);