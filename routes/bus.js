let express = require('express');
let router = express.Router();
const Bus = require('../models/Bus');
require('dotenv').config();
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator');

/* GET users listing. */
router.get('/', function (req, res, next) {
    Bus.find(function (err, response) {
        if (err) res.send(err)
        else res.json({ 'All drivers are': response })
    })
});


// function to generate token  
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(403);
    jwt.verify(token, process.env.SECRET_TOKEN_FOR_USER, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user;
        next()
    })

}


//  Adding the driver
router.post('/add', [
    check('busType', 'Enter a valid name').not().notEmpty(),
    check('busNumber', 'Enter a four digit number').isNumeric().notEmpty().isLength({ min: 4 }),
    check('startCity', 'Enter a valid city').not().notEmpty(),
    check('destination', 'Enter a valid destination').not().notEmpty(),
    check('totalSeats', 'Enter valid number of seats').isNumeric().notEmpty(),
    check('availableSeats', 'Enter valid number of seats').isNumeric().notEmpty(),
    check('pricePerSeat', 'Enter valid price for the seat').isNumeric().notEmpty(),
    check('departureDate', 'Enter a valid date').not().notEmpty(),
    check('departureTime', 'Enter a valid time').not().notEmpty(),
    check('duration', 'Enter a valid duration').not().notEmpty()

], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {

        let newDriver = new Bus({
            busType: req.body.busType,
            busNumber: req.body.busNumber,
            startCity: req.body.startCity,
            destination: req.body.destination,
            totalSeats: req.body.totalSeats,
            availableSeats: req.body.availableSeats,
            pricePerSeat: req.body.pricePerSeat,
            departureDate: req.body.departureDate,
            departureTime: req.body.departureTime,
            duration: req.body.duration
        });
        const result = await newDriver.save()
        res.json(result)

    } catch (error) {
        res.json(error)
    }

});


// To get bus details
router.post('/get', async (req, res) => {
    const pps = { pricePerSeat: req.body.pricePerSeat };
    const start = { startCity: req.body.startCity };
    const busNum = { busNumber: req.body.busNumber };
    const depDate = { departureDate: req.body.departureDate };
    const dest = { destination: req.body.destination };
    try {
        const bus = await Bus.findOne(pps || start || busNum || depDate || dest)
        res.json(bus)
    } catch (error) {
        console.log(error);
        res.json(error)
    }
})



module.exports = router;