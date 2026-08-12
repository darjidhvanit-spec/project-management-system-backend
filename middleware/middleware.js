const jwt =  require("jsonwebtoken");
const {CODES} =  require("../config/constant");
const Validator =  require('Validator');
const cors = require("cors");


const useAPIKEY = (req, res, next) => {
    
    if (req.headers?.[process.env.API_KEY] === process.env.API_VALUE) {

        next();
    } else {
        responseSend(res, CODES?.UNAUTHORIZED, false, "Invalid API Key", {})
    }
};


const responseSend = (res, code, success, message, data = {}) => {
    return res.status(201).json({
        code: code,
        success: success,
        message: message,
        data: data
    });
};

const checkValidationRules = (request, rules) => {
    try {

        const v = Validator.make(request, rules);

        const validator = {
            status: true,
        }

        if (v.fails()) {
            const ValidatorErrors = v.getErrors();
            validator.status = false
            for (const key in ValidatorErrors) {
                validator.error = ValidatorErrors[key][0];
                break;
            }
        }
        return validator;
    } catch (error) {
        console.log(error);

        console?.log(error.message)

    }

    return false;
};



module.exports = {
    useAPIKEY: useAPIKEY,
    responseSend: responseSend,
    checkValidationRules :checkValidationRules

};