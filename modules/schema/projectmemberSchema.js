const mongoose = require("mongoose");

const projectmemberSchema = new mongoose.Schema({

    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tbl_project",
        required: true
    },
    userId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "tbl_user",
        required: true
    }],

    addedBy: {
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


}, { timestamps: true });

module.exports = mongoose.model("tbl_project_member", projectmemberSchema);