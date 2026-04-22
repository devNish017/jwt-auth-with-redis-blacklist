import { client } from "../config/redis.js";


const windowSize=60;
const maxRequest=5;

 const  rateLimiter= async(req,res,next)=>{
    try{
    const key= `IP:${req.ip}`;
    const curr_time=Date.now()/1000;
    const window_Time= curr_time-windowSize;

    await client.zRemRangeByScore(key,0,window_Time);

    const number_ofRequest= await client.zCard(key);
// yaha se hame totl nuber of request mil rhi  h 

if(number_ofRequest>=maxRequest){
    return res.status(429).json({ message: "Too many requests, try again later" });
}

     await client.zAdd(key,[{score:curr_time , value:`${Math.random()}`}]) 

     await client.expire(key,windowSize);     
    
     return next();
   }
   catch(err){
    return res.status(500).json({message:"INTERNAL SERVER ERROR"})
   }

}


export default rateLimiter;
