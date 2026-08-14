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

        const projectmemberadd =
            await projectmember.create({
                projectId,
                userId,
                addedBy
            });

        const projectMemberData =
            await projectmember.aggregate([

                {
                    $match: {
                        _id: projectmemberadd._id
                    }
                },

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

// update project member query  
exports.updateProjectMember = async (req, res) => {
    try {
        const { projectMemberId, userId, addedBy } = req;

        if (!projectMemberId) {
            return responseSend(
                res,
                CODES.BAD_REQUEST,
                false,
                "Project Member ID is required",
                {}
            );
        }

        if (!userId) {
            return responseSend(
                res,
                CODES.BAD_REQUEST,
                false,
                "User ID is required",
                {}
            );
        }

        const projectMemberData =
            await projectmember.findOne({
                _id: projectMemberId
            });

        if (!projectMemberData) {
            return responseSend(
                res,
                CODES.NOT_FOUND,
                false,
                "Project member not found",
                {}
            );
        }


        const projectData = await project.findOne({
            _id: projectMemberData.projectId
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


        const userData = await user.findOne({
            _id: userId
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


        if (addedBy) {
            const addedByUser = await user.findOne({
                _id: addedBy
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
        }

        const existingMember =
            await projectmember.findOne({
                projectId: projectMemberData.projectId,
                userId: userId,
                _id: {
                    $ne: projectMemberId
                }
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

        const updateData = {
            userId
        };

        if (addedBy) {
            updateData.addedBy = addedBy;
        }

        const projectMemberUpdate =
            await projectmember.findByIdAndUpdate(
                projectMemberId,
            );

        const updatedProjectMemberData =
            await projectmember.aggregate([

                {
                    $match: {
                        _id: projectMemberUpdate._id
                    }
                },

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

        return responseSend(res, CODES.SUCCESS, true, "Project member updated successfully", updatedProjectMemberData);

    } catch (error) {
        console.log("Update Project Member Error:", error);

        return responseSend(res, CODES.INTERNAL_SERVER_ERROR, false, "Error updating project member", error.message
        );
    }
};

// delete project member query  
exports.deleteProjectMember = async (req, res) => {
    try {
        const { projectMemberId } = req;

        // Check User Id
        if (!projectMemberId) {
            return responseSend(res, CODES?.BAD_REQUEST, false, "Project  Member Id is required", {});
        }

        // Check User Exists
        const projectmemberData = await projectmember.findById(projectMemberId);

        if (!projectmemberData) {
            return responseSend(res, CODES?.NOT_FOUND, false, "Project Member not found", {}
            );
        }

        // Delete User
        await projectmember.findByIdAndDelete(projectMemberId);

        return responseSend(res, CODES?.SUCCESS, true, "Project Member deleted successfully", projectmemberData
        );

    } catch (error) {
        console.log("DELETE USER ERROR =>", error);
        return responseSend(res, CODES?.INTERNAL_SERVER_ERROR, false, "Error deleting project member",
            {}
        );
    }
};