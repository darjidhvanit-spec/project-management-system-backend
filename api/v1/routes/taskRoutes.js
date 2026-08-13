const express =  require("express");
const router =  express.Router();
const Task_Routes =  require("../../v1/controllers/taskControllers");

//routes

router.post("/task_add",Task_Routes.createTask);

router.get("/task_list",Task_Routes.getTask);

module.exports =  router;