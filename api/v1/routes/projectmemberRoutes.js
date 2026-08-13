const express =  require("express");
const router =  express.Router();
const Project_Member_Routes = require("../../v1/controllers/projectmemberControllers");

//routes

router.post("/projectmember_add",Project_Member_Routes.createProjectMember);

router.get("/projectmember_list",Project_Member_Routes.getProjectMember);

router.put("/projectmember_update",Project_Member_Routes.updateProjectMember);

router.delete("/projectmember_delete",Project_Member_Routes.deleteProjectMember);



module.exports =  router;