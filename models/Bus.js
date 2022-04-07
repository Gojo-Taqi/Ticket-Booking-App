const mongoose = require('mongoose');
const busSchema = new mongoose.Schema({
    adminInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    busType: {
        type: String,
        enum: ["AC", "Delux", "Normal", "Suspense AC", "Suspense Delux"]
    },
    busNumber: {
        type: Number,
        required: true,
        maxlength: 32
    },
    startCity: {
        type: String,
        required: true,
        enum: ["Chennai", "Banglore", "Coimbatore", "Cochin", "Mumbai"]
    },
    destination: {
        type: String,
        required: true,
        enum: ["Chennai", "Banglore", "Coimbatore", "Cochin", "Mumbai"]
    },
    totalSeats: {
        type: Number,
        default: 30,
        maxlength: 60
    },
    availableSeats: {
        type: Number,
        maxlength: 60
    },
    pricePerSeat: {
        type: Number
    },
    departureDate: {
        type: String,
        default: Date.now(),
    },
    departureTime: {
        type: String,
        maxlength: 32
    },
    duration: {
        type: String,
        maxlength: 32
    }
})

const Bus = mongoose.model('Bus', busSchema);
module.exports = Bus;