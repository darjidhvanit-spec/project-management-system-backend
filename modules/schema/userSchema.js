const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,

    },
    password :{
        type :String, 
        required : true,
    },
    role :{
        type : String,
        enum: ["Admin","Manager","Member"],
        default:"Member"
    },
     isActive: {
        type: Boolean,
        default: true
    },

    isDelete: {
        type: Boolean,
        default: false
    }
},{timestamps:true});

module.exports =  mongoose.model("tbl_user",userSchema);

