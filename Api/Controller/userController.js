const userModel= require('../Model/userModel')
const bcrypt = require('bcrypt');

const addUser  = async (nameUser,password,address,phone,payment)=>{
const HashPass= await bcrypt.hash(password, 10);
const user = new userModel ({nameUser,password:HashPass,address,phone,payment})

console.log('Hashed password from DB:', password);
await user.save()
return user
}

const editUser= async (id,update) =>{
const user= await userModel.findByIdAndUpdate(id,update)
return user
}

const deleteUser = async (id)=>{
const user=await userModel.findByIdAndDelete(id)
return user
}
const getAllUser = async ()=>{
const user = await userModel.find({})
return user
}

module.exports={addUser,editUser,deleteUser,getAllUser}