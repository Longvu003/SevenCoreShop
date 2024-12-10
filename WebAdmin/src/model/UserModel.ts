
export interface UserModel{
    isLocked: any;
    _id:string,
    email:string,
    password:string,
    name:string,
    phone:string,
    address:string,
    role:string,
    cart:Array<any>,
    isVerfy:Boolean,
    createdAt:string,
    updatedAt:string,
    available:Boolean
}