const router = require("express").Router();
const { body } = require('express-validator');
const validate = require('../middleware/validateMiddleware');
const { register, login } = require("../controllers/authController");

router.post("/register",
  [
    body('name').isLength({ min: 1 }).withMessage('Name required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('idNumber').isLength({ min: 3 }).withMessage('ID number required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be 6+ chars')
  ],
  validate,
  register
);

router.post("/login",
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').exists().withMessage('Password required')
  ],
  validate,
  login
);

module.exports = router;
