let express = require('express');
let router = express.Router();
const Admin = require('../models/Admin');
const { check, validationResult } = require('express-validator');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const Bus = require('../models/Bus');
// const Bus = require('../models/BusSchm');


// Get all admins 
router.get('/', async function (req, res, next) {

  Admin.find(function (err, response) {
    if (err) res.send(err)
    else res.json({ 'All admins are': response })
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


// post route for the admin

router.post('/addsome', [
  check('companyName', 'Enter a valid company name').not().notEmpty,
  // console.log("entered"),
  check('officeAddress', 'Enter a valid address').not().notEmpty(),
  check('phone', 'Enter a valid phone number').not().notEmpty(),
  check('email', 'Enter a valid email address').isEmail(),
  check('password', 'Enter a password with 6 characters or more').isLength({ min: 6 })
], async function (req, res) {
  console.log("Entered till here atleast")
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  let admin = new Admin({
    companyName: req.body.companyName,
    officeAddress: req.body.officeAddress,
    phone: req.body.phone,
    email: req.body.email,
    password: req.body.password
  })
  console.log("The admin added is " + admin)
  await admin.save(
    function (err) {
      if (err) { console.log(err) }
    }
  );
  res.json(admin);
})



router.post('/add', [
  check('companyName', 'Enter a valid company name').not().notEmpty(),
  check('officeAddress', 'Enter a valid address').not().notEmpty(),
  check('phone', 'Enter a valid phone number').not().notEmpty(),
  check('email', 'Enter a valid email address').isEmail(),
  check('password', 'Enter a password with 6 or more characters').isLength({ min: 6 })

], async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  let newAdmin = new Admin({
    companyName: req.body.companyName,
    officeAddress: req.body.officeAddress,
    phone: req.body.phone,
    email: req.body.email,
    password: req.body.password
  })
  console.log("The new user is " + newAdmin)
  await newAdmin.save(
    function (err) {
      if (err) { console.log(err) };
    }
  );
  res.json(newAdmin)
});


// Login
router.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  let admin = await Admin.findOne({ email: email, password: password });

  if (!admin) res.status(401).json({ msg: "Invalid credentials" })
  else {

    const accessToken = jwt.sign({ email: email, password: password }, process.env.SECRET_TOKEN_FOR_USER)
    res.json({ accessToken: accessToken })
  }
})

// some protected route
router.post('/protected', authenticateToken, async (req, res) => {
  try {
    const profile = await Admin.findOne({ buses: req.buses.id }).populate('owner', ['name', 'busType'])
    if (!profile) return res.status(400).json({ msg: 'There is no profile for this user' })
    res.send(profile)
  } catch (error) {
    res.status(500).send('server error')
    console.log(error);
  }
})


// practice
router.get('/me', authenticateToken, async (req, res) => {
  try {
    // console.log("entered")
    // const admin = await Admin.findOne({ buses: req.bus.id }).populate('buses', 'busNumber');

    const buses = await Admin.findOne({ email: req.body.email }).populate('buses', 'busType');
    console.log(buses)

    // const adminPhoneNum = await Bus.findById(req.id).populate('adminInfo', 'phone')
    // const admin = await Admin.findOne({ email: req.body.email })
    if (!buses) {
      return res.status(400).json({ msg: 'There is no bus for this Owner' });
    }
    res.json(buses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error  ' + err);
  }
});





module.exports = router;