const { CODES } = require("../../../config/constant");
const { responseSend } = require("../../../middleware/middleware");
const userModel = require("../../v1/models/userModel");

// Create user insert query
exports.RegisterUser = async (req, res) => {
    try {
        let request = req.body
        const createuser = await userModel.RegisterUser(request, res);
    } catch (error) {
        responseSend(res, CODES?.INTERNAL_SERVER_ERROR, "Error fetching registrationcreate", false, {});
    }
};