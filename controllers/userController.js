const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.createUser = async (req, res) => {
    try {
        // Check for existing user
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create a new user with the request data
        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        // Save the user to the database
        await user.save();

        // Respond with success message
        res.status(201).json({ msg: 'User created successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


exports.listUsers = async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find({});
        // Send the user data back as a JSON array
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.fetchUser = async (req, res) => {
    try {
        // Fetch the user from the database using the userId provided in the route parameter
        const user = await User.findById(req.params.userId);

        // If no user is found, send a 404 response
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Respond with the user data (excluding sensitive information like the password)
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            created: user.created,
            updated: user.updated
        });
    } catch (err) {
        console.error(err.message);

        // If the error is because of an invalid object ID, send a 400 response
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'User not found' });
        }

        // Otherwise, send a 500 server error response
        res.status(500).send('Server error');
    }
};

exports.updateUser = async (req, res) => {
    try {
        // Destructure the fields you expect to update from req.body
        const { name, email, password } = req.body;

        // Find the user by ID and update it with the new values
        let user = await User.findById(req.params.userId);

        // If no user is found, send a 404 response
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Create an object with the new values (only if they exist)
        const updatedUser = {};
        if (name) updatedUser.name = name;
        if (email) updatedUser.email = email;
        if (password) {
            // Hash the new password before saving
            const salt = await bcrypt.genSalt(10);
            updatedUser.password = await bcrypt.hash(password, salt);
        }

        // Perform the update
        user = await User.findByIdAndUpdate(
            req.params.userId,
            { $set: updatedUser },
            { new: true } // This returns the updated document
        );

        // Return the updated user data
        res.json(user);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Invalid user ID' });
        }
        res.status(500).send('Server error');
    }
};

exports.deleteUser = async (req, res) => {
    try {
        // Find the user by ID
        const user = await User.findById(req.params.userId);

        // If user not found, return an error
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Delete the user from the database
        await User.findByIdAndDelete(req.params.userId);

        // Respond with success message
        res.json({ msg: 'User deleted successfully' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Invalid user ID' });
        }
        res.status(500).send('Server error');
    }
};

exports.userSignIn = async (req, res) => {
    try {
        // Find the user by email
        const user = await User.findOne({ email: req.body.email });

        // If user not found, return an error
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check the password
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // User matched, create JWT payload
        const payload = {
            user: {
                id: user.id
            }
        };

        // Sign the token with user payload and secret, then send the token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' }, // Token expires in 1 hour
            (err, token) => {
                if (err) throw err;
                res.json({ token }); // Send token back to the user
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.userSignOut = async (req, res) => {
    res.json({ msg: 'User signed out successfully' });
};