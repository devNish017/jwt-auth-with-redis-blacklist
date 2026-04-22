import { client } from "../config/redis.js";
import jwt from "jsonwebtoken"

export const authMiddleware= async(req,res,next)=>{
    const accessToken =req.cookies.accessToken
    const refreshToken=req.cookies.refreshToken

     if (!accessToken) {
        return res.status(401).json({ message: "No token" });
    }

    try{
        const payload = jwt.verify(accessToken,process.env.JWT_SECRET)

  
         const isBlocked = await client.get(`token:${accessToken}`);
   if(isBlocked){
    return res.status(401).json({message:"Token invalidated, Please login again... "})
   }

        req.user=payload
        console.log(payload)
        return next();
    }
    catch(err){
        //console.log(err)
       
        if (err.name === "TokenExpiredError" && refreshToken) {
             try{
               
           const payload= jwt.verify(refreshToken,process.env.REFRESH_SECRET)
            
           const newAccessToken= jwt.sign(
                 {id:payload.id},
                 process.env.JWT_SECRET,
                 {expiresIn:"90s"}
                )
            
                res.cookie("accessToken",newAccessToken,{
                        httpOnly:true,
                        secure:false,
                        sameSite:"lax"
                 })
                    
            req.user=payload
            return next();
                    
           
                
         }
         catch(refreshErr){
        return res.status(401).json({
                    message: "Refresh token expired, login again"
                });
        
         
        
    }
    
    }
    
     return res.status(401).json({ message: "Invalid token" });
    
     
}
};