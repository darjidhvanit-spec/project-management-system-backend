const { default: mongoose } = require("mongoose");
const { responseSend } = require("../../../middleware/middleware");
const task = require("../../../modules/schema/taskSchema");
const project = require("../../../modules/schema/projectSchema");
const user = require("../../../modules/schema/userSchema");
const { CODES } = require("../../../config/constant");

// Create task  insert query  
exports.createTask = async (req, res) => {
    try {
        const { taskTitle, description, projectId, assignedTo, priority, startDate, dueDate, status, createdBy } = req;


        const projectData = await project.findOne({
            _id: projectId,

        });

        if (!projectData) {
            return responseSend(res, CODES.NOT_FOUND, false, "Project not found", {});
        }


        const assignedUserData = await user.findOne({
            _id: assignedTo,

        });

        if (!assignedUserData) {
            return responseSend(res, CODES.NOT_FOUND, false, "Assigned user not found", {});
        }

        if (assignedUserData.role !== "Member") {
            return responseSend(res, CODES.UNAUTHORIZED, false, "Only Member can be assigned to  a task", {});
        }


        const createdByUserData = await user.findOne({
            _id: createdBy,

        });

        if (!createdByUserData) {
            return responseSend(res, CODES.NOT_FOUND, false, "Created By user not found", {}
            );
        }

        if (createdByUserData.role !== "Manager") {
            return responseSend(res, CODES.UNAUTHORIZED, false, "Only Manager can create  a task", {});
        }


        const taskadd = await task.create({
            taskTitle,
            description,
            projectId,
            assignedTo,
            priority: priority || "Medium",
            startDate,
            dueDate,
            status: status || "Todo",
            createdBy
        });

        // --------------------------------
        // Aggregation
        // --------------------------------

        const taskData = await task.aggregate([
            // Match Created Task
            {
                $match: {
                    _id: taskadd._id
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
            // Join Assigned User
            // --------------------------------
            {
                $lookup: {
                    from: "tbl_users",
                    localField: "assignedTo",
                    foreignField: "_id",
                    as: "assignedUser"
                }
            },

            {
                $unwind: {
                    path: "$assignedUser",

                }
            },

            // --------------------------------
            // Join Created By User
            // --------------------------------
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

            // --------------------------------
            // Select Response Fields
            // --------------------------------
            {
                $project: {

                    _id: 1,

                    taskTitle: 1,

                    description: 1,

                    startDate: 1,

                    dueDate: 1,

                    priority: 1,

                    status: 1,

                    // Project Details
                    project: {
                        _id: "$project._id",
                        projectName: "$project.projectName",
                        description: "$project.description",
                        priority: "$project.priority",
                        status: "$project.status"
                    },

                    // Assigned User Details
                    assignedTo: {
                        _id: "$assignedUser._id",
                        name: "$assignedUser.name",
                        email: "$assignedUser.email",
                        role: "$assignedUser.role"
                    },

                    // Created By Details
                    createdBy: {
                        _id: "$createdByUser._id",
                        name: "$createdByUser.name",
                        email: "$createdByUser.email",
                        role: "$createdByUser.role"
                    },
                }
            }
        ]);
        return responseSend(res, CODES.CREATED, true, "Task created successfully", taskData);


    } catch (error) {
        console.log("Create Task Error:", error);

        return responseSend(res, CODES.INTERNAL_SERVER_ERROR, false, "Error creating task", error.message);
    }
};

// get task list query  
exports.getTask = async (req, res) => {
    try {
        const { taskTitle, priority, status } = req;
        const page = parseInt(req.page) || 1;
        const limit = parseInt(req.per_page) || 10;

        const matchCondition = {};

        if (taskTitle) {
            matchCondition.taskTitle = {
                $regex: taskTitle,
                $options: "i"
            };
        }

        if (priority) {
            matchCondition.priority = priority;
        }

        if (status) {
            matchCondition.status = status;
        }

        const totalRecords = await task.countDocuments(matchCondition);

        const totalPages = totalRecords > 0 ? Math.ceil(totalRecords / limit) : 1;

        let currentPage = page;

        if (currentPage > totalPages) {
            currentPage = 1;
        }

        const skip = (currentPage - 1) * limit;


        const taskData = await task.aggregate([

            {
                $match: matchCondition
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
                    localField: "assignedTo",
                    foreignField: "_id",
                    as: "assignedUser"
                }
            },

            {
                $unwind: {
                    path: "$assignedUser",

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

                    taskTitle: 1,

                    description: 1,

                    startDate: 1,

                    dueDate: 1,

                    priority: 1,

                    status: 1,

                    // Project Details
                    project: {
                        _id: "$project._id",
                        projectName: "$project.projectName",
                        priority: "$project.priority",
                        status: "$project.status"
                    },

                    // Assigned User Details
                    assignedTo: {
                        _id: "$assignedUser._id",
                        name: "$assignedUser.name",
                        email: "$assignedUser.email",
                        role: "$assignedUser.role"
                    },

                    // Created By Details
                    createdBy: {
                        _id: "$createdByUser._id",
                        name: "$createdByUser.name",
                        email: "$createdByUser.email",
                        role: "$createdByUser.role"
                    },

                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            }
        ]);

        return responseSend(res, CODES.SUCCESS, true, "Task list fetched successfully",
          
            {
                taskData,
                pagination: {
                    totalRecords,
                    currentPage: page,
                    perPage: limit,
                    totalPages: Math.ceil(totalRecords / limit)
                }

            }
        );

    } catch (error) {
        console.log("Get Task List Error:", error);

        return responseSend(res, CODES.INTERNAL_SERVER_ERROR, false, "Error fetching task list", {});
    }
};

// update task query  
exports.updateTask = async (req, res) => {
    try {

        const { taskId, taskTitle, description, projectId, assignedTo, priority, startDate, dueDate, status } = req;

        if (!taskId) {
            return responseSend(
                res,
                CODES.BAD_REQUEST,
                false,
                "Task ID is required",
                {}
            );
        }

        const taskData = await task.findOne({
            _id: taskId
        });

        if (!taskData) {
            return responseSend(
                res,
                CODES.NOT_FOUND,
                false,
                "Task not found",
                {}
            );
        }

        if (projectId) {

            const projectData = await project.findOne({
                _id: projectId
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
        }

        if (assignedTo) {

            const assignedUserData = await user.findOne({
                _id: assignedTo
            });

            if (!assignedUserData) {
                return responseSend(
                    res,
                    CODES.NOT_FOUND,
                    false,
                    "Assigned user not found",
                    {}
                );
            }
        }

        const updateData = {};

        if (taskTitle !== undefined) {
            updateData.taskTitle = taskTitle;
        }

        if (description !== undefined) {
            updateData.description = description;
        }

        if (projectId !== undefined) {
            updateData.projectId = projectId;
        }

        if (assignedTo !== undefined) {
            updateData.assignedTo = assignedTo;
        }

        if (priority !== undefined) {
            updateData.priority = priority;
        }

        if (startDate !== undefined) {
            updateData.startDate = startDate;
        }

        if (dueDate !== undefined) {
            updateData.dueDate = dueDate;
        }

        if (status !== undefined) {
            updateData.status = status;
        }



        const updatedTask = await task.findOneAndUpdate(
            {
                _id: taskId
            },
            {
                $set: updateData
            },
        );


        const result = await task.aggregate([

            {
                $match: {
                    _id: updatedTask._id
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
                    localField: "assignedTo",
                    foreignField: "_id",
                    as: "assignedUser"
                }
            },

            {
                $unwind: {
                    path: "$assignedUser",

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

                    taskTitle: 1,

                    description: 1,

                    startDate: 1,

                    dueDate: 1,

                    priority: 1,

                    status: 1,

                    // Project Details
                    project: {
                        _id: "$project._id",
                        projectName: "$project.projectName",
                        description: "$project.description",
                        priority: "$project.priority",
                        status: "$project.status"
                    },

                    // Assigned User Details
                    assignedTo: {
                        _id: "$assignedUser._id",
                        name: "$assignedUser.name",
                        email: "$assignedUser.email",
                        role: "$assignedUser.role"
                    },

                    // Created By Details
                    createdBy: {
                        _id: "$createdByUser._id",
                        name: "$createdByUser.name",
                        email: "$createdByUser.email",
                        role: "$createdByUser.role"
                    }
                }
            }
        ]);

        return responseSend(res, CODES.SUCCESS, true, "Task updated successfully", result);

    } catch (error) {
        console.log("Update Task Error:", error);
        return responseSend(res, CODES.INTERNAL_SERVER_ERROR, false, "Error updating task", error.message);
    }
};

//delete Task query  
exports.deleteTask = async (req, res) => {
    try {
        const { taskId } = req;

        // Check User Id
        if (!taskId) {
            return responseSend(res, CODES?.BAD_REQUEST, false, "Task Id is required", {});
        }

        // Check User Exists
        const taskData = await task.findById(taskId);

        if (!taskData) {
            return responseSend(res, CODES?.NOT_FOUND, false, "Task not found", {}
            );
        }

        // Delete User
        await task.findByIdAndDelete(taskId);

        return responseSend(res, CODES?.SUCCESS, true, "Task deleted successfully", taskData
        );

    } catch (error) {
        console.log("DELETE USER ERROR =>", error);
        return responseSend(res, CODES?.INTERNAL_SERVER_ERROR, false, "Error deleting task",
            {}
        );
    }
};
