const { default: mongoose } = require("mongoose");
const { responseSend } = require("../../../middleware/middleware");
const user = require("../../../modules/schema/userSchema");
const { CODES } = require("../../../config/constant");

// Create User Insert Query 

exports.RegisterUser = async (req, res) => {
    try {
        const { name, email, password, role } = req;


        // check  duplicate email
        const emailExists = await user.findOne({ email });
        if (emailExists) {
            return responseSend(res, CODES?.BAD_REQUEST, false, "Email already exists", {});
        }

        //  insert in to object  in database 
        const userData = { name: name, email: email, password: password, role:role };

        //insert user 
        const addData = await user.create(userData);

        console.log("add data",addData);

        responseSend(res, CODES?.CREATED, true, "Registration  user Successful", addData);
        
    } catch (error) {
        responseSend(res, CODES?.INTERNAL_SERVER_ERROR, false, "Error Creating registration", {});
    }

};

// get user list  query
exports.getUser = async (req,  res) =>{
    try {
        const userList = await user.find().sort({ createdAt: -1 });

        return responseSend(res, CODES?.SUCCESS, true, "User List Fetch Successfully", userList);
    } catch (error) {
        console.log(error);
        return responseSend(res, CODES?.INTERNAL_SERVER_ERROR, false, "Error Fetching User List", {});
    }
};