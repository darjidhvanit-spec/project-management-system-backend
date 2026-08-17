const { default: mongoose } = require("mongoose");
const { responseSend } = require("../../../middleware/middleware");
const project = require("../../../modules/schema/projectSchema");
const user = require("../../../modules/schema/userSchema");
const { CODES } = require("../../../config/constant");

// Create Project Insert Query
exports.createProject = async (req, res) => {
    try {
        const { projectName, description, startDate, endDate, priority, status, createdBy } = req;


        const userData = await user.findOne({
            _id: createdBy
        });
        if (!userData) {
            return responseSend(res, CODES?.NOT_FOUND, false, "User not found", {});
        }

        if (userData.role !== "Manager") {
            return responseSend(res, CODES?.UNAUTHORIZED, false, "Only Manager can create a project", {});
        }

        const projectadd = await project.create({ projectName, description, startDate, endDate, priority: priority || "Medium", status: status || "Planning", createdBy });


        const projectData = await project.aggregate([
            {
                $match: {
                    _id: projectadd._id
                }
            },

            {
                $lookup: {
                    from: "tbl_users",
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "createdByUser"
                }
            },

            {
                $unwind: {
                    path: "$createdByUser",

                }
            },

            {
                $project: {
                    _id: 1,
                    projectName: 1,
                    description: 1,
                    startDate: 1,
                    endDate: 1,
                    priority: 1,
                    status: 1,


                    createdBy: {
                        _id: "$createdByUser._id",
                        name: "$createdByUser.name",
                        email: "$createdByUser.email",
                        role: "$createdByUser.role"
                    }
                }
            }
        ]);
        responseSend(res, CODES?.CREATED, true, "Project created successfully", projectData);

    } catch (error) {
        responseSend(res, CODES?.INTERNAL_SERVER_ERROR, false, "Error creating project", {});
    }
};

// get project list query  
exports.getProject = async (req, res) => {
    try {
        // const { projectName, priority, status } = req;

        // const matchCondition = {};

        // if (projectName) {
        //     matchCondition.projectName = {
        //         $regex: projectName,
        //         $options: "i"
        //     }
        // }

        // if (priority) {
        //     matchCondition.priority = priority;
        // }

        // if (status) {
        //     matchCondition.status = status;
        // }


        const projectData = await project.aggregate([
            // {
            //     $match: matchCondition
            // },

            // Join tbl_users
            {
                $lookup: {
                    from: "tbl_users",
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "createdByUser"
                }
            },

            {
                $unwind: {
                    path: "$createdByUser",
                }
            },

            // Select Fields
            {
                $project: {
                    _id: 1,
                    projectName: 1,
                    description: 1,
                    startDate: 1,
                    endDate: 1,
                    priority: 1,
                    status: 1,

                    createdBy: {
                        _id: "$createdByUser._id",
                        name: "$createdByUser.name",
                        email: "$createdByUser.email",
                        role: "$createdByUser.role"
                    },
                }
            },

            // Latest Project First
            {
                $sort: {
                    createdAt: -1
                }
            }

        ]);
        responseSend(res, CODES?.SUCCESS, true, "Project list fetched successfully", projectData
        );

    } catch (error) {
        console.log("Get Project List Error:", error);
        responseSend(res, CODES?.INTERNAL_SERVER_ERROR, false, "Error fetching project list", {}
        );
    }
};

// Update Project Query  
exports.updateProject = async (req, res) => {
    try {

        const { projectId, projectName, description, startDate, endDate, priority, status } = req;

        if (!projectId) {
            return responseSend(res, CODES.BAD_REQUEST, false, "Project ID is required", {});
        }

        const projectData = await project.findOne({
            _id: projectId,

        });

        if (!projectData) {
            return responseSend(res, CODES.NOT_FOUND, false, "Project not found", {});
        }

        const updateData = { projectName, description, startDate, endDate, priority, status };

        const projectUpdate = await project.findByIdAndUpdate(
            projectId,
            {
                $set: updateData
            },
            {
                new: true,

            }
        );

        const updatedProjectData = await project.aggregate([

            // Find Updated Project
            {
                $match: {
                    _id: projectUpdate._id
                }
            },

            // Join tbl_users
            {
                $lookup: {
                    from: "tbl_users",
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "createdByUser"
                }
            },

            {
                $unwind: {
                    path: "$createdByUser",

                }
            },

            // Select Fields
            {
                $project: {
                    _id: 1,
                    projectName: 1,
                    description: 1,
                    startDate: 1,
                    endDate: 1,
                    priority: 1,
                    status: 1,

                    createdBy: {
                        _id: "$createdByUser._id",
                        name: "$createdByUser.name",
                        email: "$createdByUser.email",
                        role: "$createdByUser.role"
                    },

                }
            }
        ]);

        return responseSend(res, CODES.SUCCESS, true, "Project updated successfully", updatedProjectData);

    } catch (error) {
        console.log("Update Project Error:", error);

        return responseSend(res, CODES.INTERNAL_SERVER_ERROR, false, "Error updating project", {}
        );
    }
};

// delete project query  
exports.deleteProject = async (req, res) => {
    try {
        const { projectId } = req;

        // Check User Id
        if (!projectId) {
            return responseSend(res, CODES?.BAD_REQUEST, false, "Project Id is required", {});
        }

        // Check User Exists
        const projectData = await project.findById(projectId);

        if (!projectData) {
            return responseSend(res, CODES?.NOT_FOUND, false, "Project not found", {}
            );
        }

        // Delete User
        await project.findByIdAndDelete(projectId);

        return responseSend(res, CODES?.SUCCESS, true, "Project deleted successfully", projectData
        );

    } catch (error) {
        console.log("DELETE USER ERROR =>", error);
        return responseSend(res, CODES?.INTERNAL_SERVER_ERROR, false, "Error deleting project",
            {}
        );
    }
};