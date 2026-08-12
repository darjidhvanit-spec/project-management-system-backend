const { default: mongoose } = require("mongoose");
const { responseSend } = require("../../../middleware/middleware");
const project =  require("../../../modules/schema/projectSchema");
const { CODES } = require("../../../config/constant");

// Create Project Insert Query
exports.createProject =  async (req,  res) =>{
    try {
        const {projectName ,description ,startDate,endDate,priority ,status,createdBy}=  req;

        const projectadd = await project.create({projectName,description,startDate,endDate, priority: priority || "Medium", status: status || "Planning",createdBy });

        // -----------------------------
        // Aggregation with User Lookup
        // -----------------------------

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
                    // isActive: 1,
                    // isDelete: 1,
                    // createdAt: 1,
                    // updatedAt: 1,

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
exports.getProject =  async (req ,  res) =>{
    try {
        const projectData = await project.aggregate([

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