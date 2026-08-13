const { default: mongoose } = require("mongoose");
const { responseSend } = require("../../../middleware/middleware");
const task =  require("../../../modules/schema/taskSchema");
const project =  require("../../../modules/schema/projectSchema");
const user =  require("../../../modules/schema/userSchema");
const { CODES } = require("../../../config/constant");

// Create task  insert query  
exports.createTask = async(req ,  res) =>{
     try {
        const {taskTitle ,description ,projectId ,assignedTo ,priority ,startDate ,dueDate ,status ,createdBy}=req;


        const projectData = await project.findOne({
            _id: projectId,
            
        });

        if (!projectData) {
            return responseSend( res, CODES.NOT_FOUND, false, "Project not found", {});
        }


        const assignedUserData = await user.findOne({
            _id: assignedTo,
           
        });

        if (!assignedUserData) {
            return responseSend(  res, CODES.NOT_FOUND, false, "Assigned user not found",{} );
        }


        const createdByUserData = await user.findOne({
            _id: createdBy,
        
        });

        if (!createdByUserData) {
            return responseSend( res, CODES.NOT_FOUND,  false, "Created By user not found", {}
            );
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
        return responseSend( res, CODES.CREATED, true, "Task created successfully", taskData);


    } catch (error) {
        console.log( "Create Task Error:", error );

        return responseSend( res, CODES.INTERNAL_SERVER_ERROR, false, "Error creating task", error.message);
    }
};

// get task list query  
exports.getTask = async (req ,  res) =>{
   try {
        const taskData = await task.aggregate([

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
            }
        ]);

        return responseSend( res, CODES.SUCCESS, true, "Task list fetched successfully",taskData);

    } catch (error) {
        console.log( "Get Task List Error:", error);

        return responseSend( res, CODES.INTERNAL_SERVER_ERROR, false,"Error fetching task list", {});
    }
};


