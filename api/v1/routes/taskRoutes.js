const express =  require("express");
const router =  express.Router();
const Task_Routes =  require("../../v1/controllers/taskControllers");

//routes

router.post("/task_add",Task_Routes.createTask);

router.post("/task_list",Task_Routes.getTask);

router.put("/task_update",Task_Routes.updateTask);

router.delete("/task_delete",Task_Routes.deleteTask);

module.exports =  router;