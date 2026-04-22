import User_model from "../model/user.model.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import { client } from "../config/redis.js";


export const signup =async (req,res)=>{
    try{
      const {name,DOB,email,password}=req.body;
       console.log(req.body)
      const user= await User_model.findOne({email});

      if(user){
        return res.status(409).json({message:"User already registered..."})
      }
        // agar user registerd nahi h to ab uska password store karayenge 
        const salt=await bcrypt.genSalt(10);
        const hash_password= await bcrypt.hash(password,salt);
       
        const newUser= await User_model.create({
            name,DOB,email,password:hash_password
        })
        return res.status(201).json({message:"newUser registered successfully.."})
    }
    catch(err){
        return res.status(500).json({
            message:"Server Error..",
            error:err.message
        })
    }

}

export const login= async(req,res)=>{

    try{
    const {email,password}=req.body;
    const user= await User_model.findOne({email})

  

    if(user){
       
        const isMatch= await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({message:"email and password not matched.."})
        }

        // ab yaha ham jwt generate kr reh h  signature bana rhe h
        const token =jwt.sign({
            id:user._id,
            email:user.email,},
            process.env.JWT_SECRET,
            {expiresIn:"90s"}
        )
     
        //  refresh token bana rhe h taki jab acces token expire ho jaye to user refresh
        //  token se automatic login ho jaye  

        const refresh_token=jwt.sign(
            {id:user._id,
              email:user.email
            },
            process.env.REFRESH_SECRET,
            {expiresIn:'300s'}
        )

        // idhar cookie mein store kr rahe h ..
     console.log("from nishant: ",token)
        res.cookie("accessToken",token,{
            httpOnly:true,
            secure: false,      
            sameSite: "lax"
        })

        res.cookie("refreshToken",refresh_token,{
          httpOnly:true,
          secure:false,
          sameSite:"lax"
        })

 return res.status(200).json({message:"Login Successfull..."})
        
    }
    return res.status(404).json({
        message:"Sorry you are not registered..."
    })
}
   catch(err){
    return res.status(500).json({
        message:"server error",
        error:err.message
    })
   }

}


export const profile=async (req,res)=>{
    try{
    const user= await User_model.findById(req.user.id)

     if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
     res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        DOB: user.DOB
    });
}
catch(err){
    res.status(500).json({
        message:"server error...",
      error:err.message
    })
}

}


export const logout= async(req,res)=>{

    try {
        const {accessToken}= req.cookies;
        console.log("this is token : "+accessToken)

        

        const payload=req.user
       

        await client.set(`token:${accessToken}`,"blocked");
        await client.expireAt(`token:${accessToken}`,payload.exp); 

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken")
        return res.status(200).json({message:"logout successfully..."})

    } catch (err) {
            return res.status(500).json({"Error ":err.message})        
    }
}
//is method mein ham token ko null kre de rhe h 
  
// export const logout=((req,res)=>{

//     try {
//         res.cookie("accessToken",null,{
//             expires:new Date(Date.now())
//         });
//         res.send("Loged out successfulyy..")

//     } catch (err) {
//            res.send("Error :",err.message)        
//     }
// })



//   ye bhi ek tarika hi invalid token bhej ke logout karne ka user ko 

// export const logout=((req,res)=>{

//     try {
//         res.cookie("accessToken","kjsskcnkscskcnskcl");
//         res.send("Loged out successfulyy..")

//     } catch (err) {
//            res.send("Error :",err.message)        
//     }
// })
