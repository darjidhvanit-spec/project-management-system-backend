const { default: mongoose } = require("mongoose");
const { responseSend, generateToken } = require("../../../middleware/middleware");
const user = require("../../../modules/schema/userSchema");
const project = require("../../../modules/schema/projectSchema");
const task = require("../../../modules/schema/taskSchema");
const { CODES } = require("../../../config/constant");

// Create User Insert Query 
exports.RegisterUser = async (req, res) => {
    try {
        const { name, email, password, role } = req;


        const nameRegex = /^[A-Za-z]+$/;

        if (!nameRegex.test(name.trim())) {
            return responseSend(
                res,
                CODES?.BAD_REQUEST,
                false,
                "Name must contain only letters",
                {}
            );
        }

        const emailRegex =
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(email.trim())) {
            return responseSend(
                res,
                CODES?.BAD_REQUEST,
                false,
                "Please enter a valid email address",
                {}
            );
        }



        const emailExists = await user.findOne({
            email
        });

        if (emailExists) {
            return responseSend(
                res,
                CODES?.BAD_REQUEST,
                false,
                "Email already exists",
                {}
            );
        }


        const userData = {
            name,
            email,
            password,
            role
        };

        const addData = await user.create(userData);

        console.log("add data", addData);

        return responseSend(
            res,
            CODES?.CREATED,
            true,
            "Registration user successful",
            addData
        );

    } catch (error) {
        console.log("Register User Error:", error);

        return responseSend(
            res,
            CODES?.INTERNAL_SERVER_ERROR,
            false,
            "Error creating registration",
            {}
        );
    }
};


// get user list  query
exports.getUser = async (req, res) => {
    try {
        const userList = await user.find().sort({ createdAt: -1 });

        return responseSend(res, CODES?.SUCCESS, true, "User List Fetch Successfully", userList);
    } catch (error) {
        console.log(error);
        return responseSend(res, CODES?.INTERNAL_SERVER_ERROR, false, "Error Fetching User List", {});
    }
};

// get user login query  
exports.getloginUser = async (req, res) => {
    try {
        const { email, password } = req;

        const userData = await user.findOne({
            email,

        });

        if (!userData) {
            return responseSend(
                res,
                CODES.BAD_REQUEST,
                false,
                "Invalid Email",
                {}
            );
        }

        // Password Check
        if (userData.password !== password) {
            return responseSend(
                res,
                CODES.BAD_REQUEST,
                false,
                "Invalid Password",
                {}
            );
        }
        // Generate Token
        const token = generateToken(userData._id);

        // Update Device Info
        await user.findByIdAndUpdate(
            userData._id,
            {
                device_info: {
                    token,
                    device_type: req.device_type || "",
                    device_token: req.device_token || "",
                    device_name: req.device_name || "",
                    os_version: req.os_version || "",
                    ip: req.ip || ""
                }
            },
            { new: true }
        );

        const updatedUserData = await user.findById(userData._id);

        return responseSend(
            res,
            CODES.SUCCESS,
            true,
            "Login Successfully",
            updatedUserData
        );

    } catch (error) {

        return responseSend(
            res,
            CODES.INTERNAL_SERVER_ERROR,
            false,
            "Error in Auth User",
            error.message
        );
    }

};

// get user logout query 
exports.logoutUser = async (req, res) => {
    try {

        const logoutData = await user.findOneAndUpdate(
            { _id: req.user_id },
            {
                $set: {
                    "device_info.token": "",
                    "device_info.device_type": "",
                    "device_info.device_token": "",
                    "device_info.device_name": "",
                    "device_info.os_version": "",
                    "device_info.ip": ""
                }
            },
            { new: true }
        );

        // user not found
        if (!logoutData) {
            return responseSend(res, CODES?.ERROR, false, "Invalid token", {});
        }

        return responseSend(res, CODES?.SUCCESS, true, "Logout successfully", logoutData);

    } catch (error) {
        return responseSend(res, CODES?.INTERNAL_SERVER_ERROR, false, "Error in Logout");
    }
};

//update user query  
exports.updateUser = async (req, res) => {
    try {
        const { userId, name, email, password, role } = req;

        const emailExists = await user.findOne({ email });
        if (emailExists) {
            return responseSend(res, CODES?.BAD_REQUEST, false, "Email already exists", {});
        }

        if (!userId) {
            return responseSend(
                res,
                CODES?.BAD_REQUEST,
                false,
                "User Id is required",
                {}
            );
        }

        // check user exists
        const userData = await user.findById(userId);

        if (!userData) {
            return responseSend(
                res,
                CODES?.NOT_FOUND,
                false,
                "User not found",
                {}
            );
        }

        const updatedUser = await user.findByIdAndUpdate(
            userId,
            { name, email, password, role, },
            {
                new: true
            }
        );
        responseSend(res, CODES?.SUCCESS, true, "User updated successfully", updatedUser);

    } catch (error) {
        responseSend(res, CODES?.INTERNAL_SERVER_ERROR, false, "Error updating user", {});
    }
};

//delete user query  
exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req;

        // Check User Id
        if (!userId) {
            return responseSend(
                res,
                CODES?.BAD_REQUEST,
                false,
                "User Id is required",
                {}
            );
        }

        // Check User Exists
        const userData = await user.findById(userId);

        if (!userData) {
            return responseSend(
                res,
                CODES?.NOT_FOUND,
                false,
                "User not found",
                {}
            );
        }

        // Delete User
        await user.findByIdAndDelete(userId);

        return responseSend(res, CODES?.SUCCESS, true, "User deleted successfully", userData
        );

    } catch (error) {
        console.log("DELETE USER ERROR =>", error);
        return responseSend(res, CODES?.INTERNAL_SERVER_ERROR, false, "Error deleting user",
            {}
        );
    }
};

//get Dashboard Count query  
exports.getDashboardCount = async (req, res) => {
     try {

        const [ totalProjectCount, planningProjectCount, activeProjectCount, completedProjectCount, totalTaskCount, todoTaskCount, inProgressTaskCount, reviewTaskCount, completedTaskCount ] = await Promise.all([
            // Total Projects
            project.countDocuments(),

            // Planning Projects
            project.countDocuments({
                status: "Planning"
            }),

            // In Progress Projects
            project.countDocuments({
                status: "In Progress"
            }),

            // Completed Projects
            project.countDocuments({
                status: "Completed"
            }),

            // Total Tasks
            task.countDocuments(),

            // Todo Tasks
            task.countDocuments({
                status: "Todo"
            }),

            // In Progress Tasks
            task.countDocuments({
                status: "In Progress"
            }),

            // Review Tasks
            task.countDocuments({
                status: "Review"
            }),

            // Completed Tasks
            task.countDocuments({
                status: "Completed"
            })
        ]);

        return responseSend(
            res,
            CODES?.SUCCESS,
            true,
            "Dashboard Count Retrieved Successfully",
            {

                // Project
                totalProjectCount,
                planningProjectCount,
                activeProjectCount,
                completedProjectCount,

                // Task
                totalTaskCount,
                todoTaskCount,
                inProgressTaskCount,
                reviewTaskCount,
                completedTaskCount

            }
        );

    } catch (error) {
        console.log("Dashboard Count Error:", error);
        return responseSend(
            res,
            CODES?.INTERNAL_SERVER_ERROR,
            false,
            "Error Fetching Dashboard Count",
            {}
        );
    }
};