const mongoose = require('mongoose');
// const { mountpath } = require('../app');
const adminSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        maxlength: 32
    },
    officeAddress: {
        type: String,
        required: true,
        maxlength: 100
    },
    phone: {
        type: Number,
        max: 9999999999,
        required: true
    },
    email: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    buses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Bus'
        }
    ]
})

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;