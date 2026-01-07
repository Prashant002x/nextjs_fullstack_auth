import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true,'Please provide a username'],
        unique:true,
        trim:true,
    },
    email:{
        type: String,
        required: [true,'Please provide an email'],
        unique:true,
        trim:true,
        lowercase:true,

    },
    password:{
        type: String,
        required: [true,'Please provide a password'],
        select:false,
    },  
    isVerified:{
        type: Boolean,
        default: false
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
    
},{
    timestamps:true
}
);

const User = mongoose.models.User ||  mongoose.model("User", userSchema);

export default User;

