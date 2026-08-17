const express =  require("express");
const router =  express.Router();
const User_Routes =  require("../../v1/controllers/userControllers");


//routes

router.post("/register_user",User_Routes.RegisterUser);

router.get("/user_list",User_Routes.getUser);

router.post("/user_login",User_Routes.getloginUser);

router.get("/user_logout",User_Routes.logoutUser);

router.put("/user_update",User_Routes.updateUser);

router.delete("/user_delete",User_Routes.deleteUser);

router.get("/dashboard_count",User_Routes.getDashboardCount);
 


module.exports =  router;