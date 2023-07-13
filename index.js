// express import and nodeserver variable declared
const express=require("express");
const nodeServer=express();

//dotenv imported and configured
const dotenv=require("dotenv");
dotenv.config();
// using .env variables assign port , hostname
const port=process.env.PORT;
const host=process.env.HOSTNAME

// creating simple api endpoint
nodeServer.get("/products",(req,res,next)=>{
    res.json({
        message:"server working!!!"
    })
})
nodeServer.use("/details", require("./scrap"));
nodeServer.use("/sample",require("./app"));
nodeServer.use("/demo",require("./webscrap"))
// nodeServer.use("/webcode",require("./appserver"))
// made server listening to port , host
nodeServer.listen(port,host,()=>{
    console.log("Server started")
})