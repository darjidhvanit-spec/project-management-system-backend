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