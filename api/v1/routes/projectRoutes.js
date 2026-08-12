const express =  require("express");
const router =  express.Router();
const Project_Routes = require("../controllers/projectControllers");

//routes

router.post("/project_add",Project_Routes.createProject);

router.get("/project_list",Project_Routes.getProject);

module.exports =  router;