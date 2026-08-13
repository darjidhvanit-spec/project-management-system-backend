const { CODES, VALIDATION_RULES } = require("../../../config/constant");
const { responseSend, checkValidationRules } = require("../../../middleware/middleware");
const projectModel = require("../../v1/models/projectModel");

// Create Project Insert Query 
exports.createProject = async (req, res) => {
    try {
        let request = req.body
        // Validation Rules
        const validationRules = {
            projectName: VALIDATION_RULES.REQUIRED,
            description: VALIDATION_RULES.REQUIRED,
            startDate: VALIDATION_RULES.REQUIRED,
            endDate: VALIDATION_RULES.REQUIRED,
            priority: VALIDATION_RULES.REQUIRED,
            status: VALIDATION_RULES.REQUIRED,
            createdBy: VALIDATION_RULES.REQUIRED,

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

        const createproject = await projectModel.createProject(request, res);

    } catch (error) {
        responseSend(res, CODES?.INTERNAL_SERVER_ERROR, "Error fetching  createproject", false, {});
    }
};

// get  project list query  
exports.getProject = async (req, res) => {
    try {
        let request = req.body
        const projectlist = await projectModel.getProject(request, res);
    } catch (error) {
        responseSend(res, CODES?.INTERNAL_SERVER_ERROR, "Error fetching projectlist", false, {});
    }
};

// Update Project Query  
exports.updateProject = async (req, res) => {
    try {
        let request = req.body
        const updateproject = await projectModel.updateProject(request, res);
    } catch (error) {
        responseSend(res, CODES?.INTERNAL_SERVER_ERROR, "Error fetching updateproject", false, {});
    }

};

// delete project query  
exports.deleteProject = async (req, res) => {
    try {
        let request = req.body
        const deleteproject = await projectModel.deleteProject(request, res);
    } catch (error) {
        responseSend(res, CODES?.INTERNAL_SERVER_ERROR, "Error fetching deleteproject", false, {});
    }

};