const jwt =  require("jsonwebtoken");
const {CODES} =  require("../config/constant");
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


module.exports = {
    useAPIKEY: useAPIKEY,
    responseSend: responseSend,

};