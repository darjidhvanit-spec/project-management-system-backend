const { default: mongoose } = require("mongoose");
const { responseSend } = require("../../../middleware/middleware");
const projectmember = require("../../../modules/schema/projectmemberSchema");
const project = require("../../../modules/schema/projectSchema");
const user = require("../../../modules/schema/userSchema");
const { CODES } = require("../../../config/constant");

//Create  project member insert query  
exports.createProjectMember = async (req, res) => {
    try {
        const { projectId, userId, addedBy } = req;

        // --------------------------------
        // Check Project
        // --------------------------------

        const projectData = await project.findOne({
            _id: projectId,

        });
        if (!projectData) {
            return responseSend(
                res,
                CODES.NOT_FOUND,
                false,
                "Project not found",
                {}
            );
        }

        // --------------------------------
        // Check User
        // --------------------------------

        const userData = await user.findOne({
            _id: userId,

        });

        if (!userData) {
            return responseSend(
                res,
                CODES.NOT_FOUND,
                false,
                "User not found",
                {}
            );
        }


        // --------------------------------
        // Check Added By User
        // --------------------------------

        const addedByUser = await user.findOne({
            _id: addedBy,
        });

        if (!addedByUser) {
            return responseSend(
                res,
                CODES.NOT_FOUND,
                false,
                "Added By user not found",
                {}
            );
        }

        // --------------------------------
        // Check Duplicate Member
        // --------------------------------

        const existingMember =
            await projectmember.findOne({
                projectId,
                userId,
            });

        if (existingMember) {
            return responseSend(
                res,
                CODES.BAD_REQUEST,
                false,
                "User is already a member of this project",
                {}
            );
        }


        // --------------------------------
        // Create Project Member
        // --------------------------------

        const projectmemberadd =
            await projectmember.create({
                projectId,
                userId,
                addedBy
            });


        // --------------------------------
        // Aggregation
        // --------------------------------
        const projectMemberData =
            await projectmember.aggregate([

                // Match inserted member
                {
                    $match: {
                        _id: projectmemberadd._id
                    }
                },

                // --------------------------------
                // Join Project
                // --------------------------------
                {
                    $lookup: {
                        from: "tbl_projects",
                        localField: "projectId",
                        foreignField: "_id",
                        as: "project"
                    }
                },

                {
                    $unwind: {
                        path: "$project",

                    }
                },

                // --------------------------------
                // Join Member User
                // --------------------------------

                {
                    $lookup: {
                        from: "tbl_users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "memberUser"
                    }
                },

                {
                    $unwind: {
                        path: "$memberUser",

                    }
                },
                // --------------------------------
                // Join Added By User
                // --------------------------------
                {
                    $lookup: {
                        from: "tbl_users",
                        localField: "addedBy",
                        foreignField: "_id",
                        as: "addedByUser"
                    }
                },
                {
                    $unwind: {
                        path: "$addedByUser",

                    }
                },
                // --------------------------------
                // Select Response Fields
                // --------------------------------
                {
                    $project: {

                        _id: 1,

                        project: {
                            _id: "$project._id",
                            projectName: "$project.projectName",
                            description: "$project.description",
                            priority: "$project.priority",
                            status: "$project.status"
                        },

                        member: {
                            _id: "$memberUser._id",
                            name: "$memberUser.name",
                            email: "$memberUser.email",
                            role: "$memberUser.role"
                        },

                        addedBy: {
                            _id: "$addedByUser._id",
                            name: "$addedByUser.name",
                            email: "$addedByUser.email",
                            role: "$addedByUser.role"
                        },
                    }
                }
            ]);

        return responseSend(res, CODES.CREATED, true, "Project member added successfully", projectMemberData);

    } catch (error) {
        console.log("Create Project Member Error:", error);

        return responseSend(res, CODES.INTERNAL_SERVER_ERROR, false, "Error creating project member", error.message);
    }
};

// get project member list query  
exports.getProjectMember = async (req, res) => {
    try {

        const projectMemberData = await projectmember.aggregate([
            // Join Project
            {
                $lookup: {
                    from: "tbl_projects",
                    localField: "projectId",
                    foreignField: "_id",
                    as: "project"
                }
            },

            {
                $unwind: {
                    path: "$project",

                }
            },

            // Join Member User
            {
                $lookup: {
                    from: "tbl_users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "memberUser"
                }
            },


            {
                $unwind: {
                    path: "$memberUser",

                }
            },

            // Join Added By User
            {
                $lookup: {
                    from: "tbl_users",
                    localField: "addedBy",
                    foreignField: "_id",
                    as: "addedByUser"
                }
            },
            {
                $unwind: {
                    path: "$addedByUser",

                }
            },

            // Select Fields
            {
                $project: {
                    _id: 1,

                    project: {
                        _id: "$project._id",
                        projectName: "$project.projectName",
                        description: "$project.description",
                        priority: "$project.priority",
                        status: "$project.status"
                    },

                    member: {
                        _id: "$memberUser._id",
                        name: "$memberUser.name",
                        email: "$memberUser.email",
                        role: "$memberUser.role"
                    },

                    addedBy: {
                        _id: "$addedByUser._id",
                        name: "$addedByUser.name",
                        email: "$addedByUser.email",
                        role: "$addedByUser.role"
                    },
                }
            },
            // Latest Member First
            {
                $sort: {
                    createdAt: -1
                }
            }
        ]);

        return responseSend(res, CODES.SUCCESS, true, "Project member list fetched successfully", projectMemberData);

    } catch (error) {
        console.log("Get Project Member Error:", error);

        return responseSend(res, CODES.INTERNAL_SERVER_ERROR, false, "Error fetching project member list", {});
    }
};