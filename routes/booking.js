let express = require('express');
let router = express.Router();
const Booking = require('../models/Booking');
require('dotenv').config();
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator');

// get token
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {

        // split at space 
        const bearer = bearerHeader.split(' ');

        // get token from the array
        const bearerToken = bearer[1];

        // set the token
        req.token = bearerToken;

        //  call the next middleware
        // res.end();
        next();

    } else {
        res.json({
            message: "The header is undefined or the web token is missing"
        });
        res.status(403)
    }
}

// login and generate token

router.post('/login', async (req, res) => {
    let book = await Booking.findOne({ email: req.body.email, password: req.body.password });

    if (!book) {
        res.json({ msg: "Invalid credentials" })
    }
    else {

        jwt.sign({ user: user.id }, process.env.SECRET_TOKEN_FOR_BOOKING, (err, token) => {
            res.json({
                token: token
            });
        });
    }

});









module.exports = router