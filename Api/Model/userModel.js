
const mongoose=require('mongoose')
const Schema=mongoose.Schema
const userAccount=new Schema(
{
    nameUser:{
        type: String,
        require:true,
    },
    password:{
        type: String,
        require:true,
    },
    address:{
      type:String,
      require: false,
    },
    phone:{
     type:String,
     require: false,
     unique:true,
    //  minlength:10
    },
     payment:{
    type: String,
    require: false
     }
})
module.exports=mongoose.model('User',userAccount)