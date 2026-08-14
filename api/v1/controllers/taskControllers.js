const { CODES, VALIDATION_RULES } = require("../../../config/constant");
const { responseSend, checkValidationRules } = require("../../../middleware/middleware");
const taskModel = require("../../v1/models/taskModel");

// Create task insert query 
exports.createTask = async (req, res) => {
    try {
        let request = req.body
        // Validation Rules
        const validationRules = {
            taskTitle: VALIDATION_RULES.REQUIRED,
            description: VALIDATION_RULES.REQUIRED,
            projectId: VALIDATION_RULES.REQUIRED,
            assignedTo: VALIDATION_RULES.REQUIRED,
            priority: VALIDATION_RULES.REQUIRED,
            startDate: VALIDATION_RULES.REQUIRED,
            dueDate: VALIDATION_RULES.REQUIRED,
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

        const createtask = await taskModel.createTask(request, res);

    } catch (error) {
        responseSend(res, CODES?.INTERNAL_SERVER_ERROR, "Error fetching  createtask", false, {});
    }
};

// get task  list query 
exports.getTask = async (req, res) => {
    try {
        let request = req.body
        const tasklist = await taskModel.getTask(request, res);
    } catch (error) {
        responseSend(res, CODES?.INTERNAL_SERVER_ERROR, "Error fetching tasklist", false, {});
    }

};

// update task query  
exports.updateTask =  async (req, res) => {
    try {
        let request = req.body
        const taskupdate = await taskModel.updateTask(request, res);
    } catch (error) {
        responseSend(res, CODES?.INTERNAL_SERVER_ERROR, "Error fetching taskupdate", false, {});
    }

};

// delete Task query 
exports.deleteTask =  async (req, res) => {
    try {
        let request = req.body
        const taskdelete = await taskModel.deleteTask(request, res);
    } catch (error) {
        responseSend(res, CODES?.INTERNAL_SERVER_ERROR, "Error fetching taskdelete", false, {});
    }

};