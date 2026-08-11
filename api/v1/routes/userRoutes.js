const express =  require("express");
const router =  express.Router();
const User_Routes =  require("../../v1/controllers/userControllers");


//routes

router.post("/register_user",User_Routes.RegisterUser);



module.exports =  router;