export interface UserModel{
    _id:String,
    email:String,
    password:String,
    name:String,
    phone:String,
    address:String,
    role:String,
    cart:Array<any>,
    isVerfy:Boolean,
    createdAt:String,
    updatedAt:String,
    available:Boolean
}