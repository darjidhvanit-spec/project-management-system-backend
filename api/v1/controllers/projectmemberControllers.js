const { CODES, VALIDATION_RULES } = require("../../../config/constant");
const { responseSend, checkValidationRules } = require("../../../middleware/middleware");
const projectmemberModel = require("../../v1/models/projectmemberModel");

// Create project member insert query  
exports.createProjectMember = async (req, res) => {
    try {
        let request = req.body
        // Validation Rules
        const validationRules = {
            projectId: VALIDATION_RULES.REQUIRED,
            userId: VALIDATION_RULES.REQUIRED,
            addedBy: VALIDATION_RULES.REQUIRED,

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

        const createproject = await projectmemberModel.createProjectMember(request, res);

    } catch (error) {
        responseSend(res, CODES?.INTERNAL_SERVER_ERROR, "Error fetching  createprojectmember", false, {});
    }

};

//get project member list query 
exports.getProjectMember = async (req, res) => {
    try {
        let request = req.body
        const projectmemberlist = await projectmemberModel.getProjectMember(request, res);
    } catch (error) {
        responseSend(res, CODES?.INTERNAL_SERVER_ERROR, "Error fetching projectmemberlist", false, {});
    }

};