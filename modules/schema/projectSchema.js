const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        default: ""
    },

    startDate: {
        type: String,
        required: true
    },

    endDate: {
        type: String,
        required: true
    },

    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium"
    },

    status: {
        type: String,
        enum: ["Planning", "In Progress", "Completed"],
        default: "Planning"
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tbl_user",
        required: true
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

module.exports = mongoose.model("tbl_project",projectSchema);