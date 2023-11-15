const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const {
  createUser,
  listUsers,
  fetchUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) {
            return res.status(401).send({ message: 'No token, authorization denied' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (e) {
        res.status(401).send({ message: 'Token is not valid' });
    }
};


// Create a user
router.post('/', createUser);

// List all users
router.get('/', listUsers);

// Fetch a user
router.get('/:userId', auth, fetchUser);

// Update a user
router.put('/:userId', auth , updateUser);

// Delete a user
router.delete('/:userId', auth, deleteUser);

module.exports = router;
