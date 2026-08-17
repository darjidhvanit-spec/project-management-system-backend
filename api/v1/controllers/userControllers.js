const { CODES, VALIDATION_RULES } = require("../../../config/constant");
const { responseSend, checkValidationRules } = require("../../../middleware/middleware");
const userModel = require("../../v1/models/userModel");

// Create user insert query
exports.RegisterUser = async (req, res) => {
    try {
        let request = req.body
        // Validation Rules
        const validationRules = {
            name: VALIDATION_RULES.REQUIRED,
            email: VALIDATION_RULES.REQUIRED,
            password: VALIDATION_RULES.REQUIRED,

        };

        const validate = await checkValidationRules(request, validationRules);

        if (!validate.status) {
            return responseSend(
                res,
                CODES.BAD_REQUEST,
                false,
                validate.error,
                {}
            );
        }

        const createuser = await userModel.RegisterUser(request, res);

    } catch (error) {
        responseSend(res, CODES?.INTERNAL_SERVER_ERROR, "Error fetching registrationcreate", false, {});
    }
};

// get user list query
exports.getUser = async (req, res) => {
    try {
        let request = req.body
        const userlist = await userModel.getUser(request, res);
    } catch (error) {
        responseSend(res, CODES?.INTERNAL_SERVER_ERROR, "Error fetching userlist", false, {});
    }

};

// get login user query 
exports.getloginUser = async (req, res) => {
    try {
        let request = req.body
        // Validation Rules
        const validationRules = {
            email: VALIDATION_RULES.REQUIRED,
            password: VALIDATION_RULES.REQUIRED,

        };

        const validate = await checkValidationRules(request, validationRules);

        if (!validate.status) {
            return responseSend(
                res,
                CODES.BAD_REQUEST,
                false,
                validate.error,
                {}
            );
        }
        const userlogin = await userModel.getloginUser(request, res);
    } catch (error) {
        responseSend(res, CODES?.INTERNAL_SERVER_ERROR, "Error fetching userlogin", false, {});
    }   

};

// get logout user query 
exports.logoutUser = async (req, res) => {
    try {
        let request = req.body
        // console.log("req headers", req.headers);
        request.user_id = req.headers.user_id;
        const userlogout = await userModel.logoutUser(request, res);
    } catch (error) {
        responseSend(res, CODES?.INTERNAL_SERVER_ERROR, "Error fetching userlogout", false, {});
    }
};

// update user query  
exports.updateUser = async (req, res) => {
    try {
        let request = req.body
        const Userupdate = await userModel.updateUser(request, res);
    } catch (error) {
        responseSend(res, CODES?.INTERNAL_SERVER_ERROR, "Error fetching Userupdate", false, {});
    }

};

// delete user query  
exports.deleteUser =  async (req ,  res) =>{
     try {
        let request = req.body
        const Userdelete = await userModel.deleteUser(request, res);
    } catch (error) {
        responseSend(res, CODES?.INTERNAL_SERVER_ERROR, "Error fetching Userdelete", false, {});
    }
};

//get Dashboard Count query  
exports.getDashboardCount =  async (req , res) =>{
      try {
        let request = req.body
        const DashboardCount = await userModel.getDashboardCount(request, res);
    } catch (error) {
        responseSend(res, CODES?.INTERNAL_SERVER_ERROR, "Error fetching DashboardCount", false, {});
    }
    
};