const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        bus: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Driver'
        },
        totalPrice: {
            type: String
        },
        numPassengers: {
            type: Number,
            default: 1
        },
        bookingStatus: {
            type: String,
            enum: ["BOOKED", "CANCELLED"]
        },
        createdTime: {
            type: String
        }
    });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;