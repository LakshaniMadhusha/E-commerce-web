import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        default:"NOT GIVEN"
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        default:"user"
    },
    isEmailVerified:{
        type:Boolean,
        default:false
    },
    image:{
        type:String,
        default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fpngtree.com%2Fso%2Fusers&psig=AOvVaw2SGthFh8YAk-X0AMqNswBd&ust=1764740202745000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCLCjy9-XnpEDFQAAAAAdAAAAABAR"
    },
    // salt: String
})

const User=mongoose.model("users",userSchema)

export default User;