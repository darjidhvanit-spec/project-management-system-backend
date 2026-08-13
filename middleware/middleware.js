const jwt =  require("jsonwebtoken");
const {CODES} =  require("../config/constant");
const Validator =  require('Validator');
const  user =  require("../modules/schema/userSchema");
const cors = require("cors");


const useAPIKEY = (req, res, next) => {
    
    if (req.headers?.[process.env.API_KEY] === process.env.API_VALUE) {

        next();
    } else {
        responseSend(res, CODES?.UNAUTHORIZED, false, "Invalid API Key", {})
    }
};

const useAuthToken = async (req, res, next) => {
    try {
        const bypassLastPaths = ["register_user","user_login","user_list","user_update","user_delete","projectmember_add","project_list","project_add","projectmember_list","task_add","task_list","project_update","project_delete"];

       // console.log("req.originalUrl.split('/')", req.originalUrl.split("/"));

        const lastPath = req.originalUrl.split("/").pop();

        if (bypassLastPaths.includes(lastPath)) {
            return next();
        }

        const headerToken = req.headers?.[process.env.Token_KEY];

        if (!headerToken) {
            return responseSend(res, CODES?.UNAUTHORIZED, false, "Token required", {});
        }

        console.log("headerToken", headerToken);

        const userData = await user.findOne({
            "device_info.token": headerToken
        });

        console.log("User:", userData);

        if (userData) {
            console.log("Token Verified");
            req.headers.user_id = userData?._id;
            next();
        } else {

            console.log("ahiya ave che else ma ?");

            return responseSend(res, CODES?.UNAUTHORIZED, false, "Invalid Token", {});
        }

    } catch (error) {
        return responseSend(
            res,
            CODES?.INTERNAL_SERVER_ERROR,
            false,
            "Token Middleware Error",
            error.message
        );
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

const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET || "mysecretkey",
        { expiresIn: "1d" }
    );
};



module.exports = {
    useAPIKEY: useAPIKEY,
    responseSend: responseSend,
    checkValidationRules :checkValidationRules,
    generateToken: generateToken,
    useAuthToken:useAuthToken

};