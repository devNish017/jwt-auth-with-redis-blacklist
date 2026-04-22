import mongoose from "mongoose"

const userSchema= new mongoose.Schema({
    name:{
       type:String,
       required:true, 

    },
    DOB:{
        type:Date,
        required:true,
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
        
    },
   
   
},
    {    
    timestamps:true

    })

export default mongoose.model("rev_user",userSchema)
