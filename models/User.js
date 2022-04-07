// import mongoose from 'mongoose';
const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 32
    },
    address: {
        type: String,
        maxlength: 100
    },
    phone: {
        type: Number,
        min: 111111111,
        max: 9999999999,
        required: true
    },
    dob: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    bookings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking'
        }
    ]
})

const User = mongoose.model('User', userSchema);
module.exports = User;