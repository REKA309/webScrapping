// IMPORTING BUILD PACKAGES
const express= require("express");
const appServer=express();
const bodyParser=require("body-parser");
// IMPORT CONTROLLERS
// const signup_controller=require("./Controllers/Signup.controller")
// USE BODY PARSER
appServer.use(bodyParser.json());
appServer.use(bodyParser.urlencoded({extended:true}));
//INJECTING CONTROLERS INTO app_server
// appServer.use("/api/v1/auth/signup", signup_controller);
appServer.get("/",(req,res)=>{res.send("super reeqyest")})
// EXPORT APPSERVER
module.exports=appServer;