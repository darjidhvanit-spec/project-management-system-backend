const express =  require("express");
const router =  express.Router();
const Project_Routes = require("../controllers/ProjectControllers");

//routes

router.post("/project_add",Project_Routes.createProject);

router.post("/project_list",Project_Routes.getProject);

router.put("/project_update",Project_Routes.updateProject);

router.delete("/project_delete",Project_Routes.deleteProject);

module.exports =  router;