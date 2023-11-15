const express = require('express');
const router = express.Router();
const { 
    userSignIn, 
    userSignOut
} = require('../controllers/userController');

// POST /auth/signin
router.post('/signin', userSignIn);

// User sign-out
router.get('/signout', userSignOut);

module.exports = router;
