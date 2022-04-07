let express = require('express');
let router = express.Router();
const User = require('../models/User');
require('dotenv').config();
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator');

/* GET users listing. */
router.get('/', async function (req, res, next) {

  User.find(function (err, response) {
    if (err) res.send(err)
    else res.json({ 'All users are': response })
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


// Route for posting a user
router.post('/add', [
  check('name', 'Enter a valid Name').not().isEmpty(),
  check('address', 'Enter a valid address').not().isEmpty(),
  check('phone', 'Enter a valid phone number').not().isEmpty(),
  check('email', 'Enter a valid email address').isEmail(),
  check('password', 'Enter a password with 6 or more characters').isLength({ min: 6 })

], async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  let newUser = new User({
    name: req.body.name,
    address: req.body.address,
    phone: req.body.phone,
    dob: req.body.dob,
    gender: req.body.gender,
    email: req.body.email,
    password: req.body.password
  })
  console.log("The new user is " + newUser)
  await newUser.save(
    function (err) {
      if (err) { console.log(err) };
    }
  );
  res.json(newUser)
});


// Route for logging in 
router.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  let user = await User.findOne({ email: email, password: password });

  if (!user) res.status(401).json({ msg: "Invalid credentials" })
  else {

    const accessToken = jwt.sign({ email: email, password: password }, process.env.SECRET_TOKEN_FOR_USER)
    res.json({ accessToken: accessToken })
  }
})


// some protected route
router.get('/some', authenticateToken, (req, res) => {
  res.send('congradulations')
})


// router.post('/someroute', async (req,res) => {
//   const user = await User.findOne({ email: req.body.email })


// })

// To book a ticket
router.post('/book', authenticateToken, async (req, res) => {
  const bookedTicket = await User.findOne()
})




module.exports = router;