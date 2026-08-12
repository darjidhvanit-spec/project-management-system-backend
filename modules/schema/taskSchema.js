const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({

    taskTitle: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        default: ""
    },

    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tbl_projects",
        required: true
    },

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tbl_users",
        required: true
    },

    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium"
    },

    startDate: {
        type: Date,
        required: true
    },

    dueDate: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        enum: ["Todo","In Progress","Review","Completed"],
        default: "Todo"
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tbl_users",
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

module.exports = mongoose.model("tbl_task", taskSchema);