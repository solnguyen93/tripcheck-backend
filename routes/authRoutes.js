const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const { ensureNotLoggedIn } = require('../middleware/auth');

// Route for user registration
router.post('/register', ensureNotLoggedIn, async (req, res) => {
    const { name, username, email, password } = req.body;
    try {
        const user = await User.register(name, username, email, password);
        // Create JWT token for authentication
        const token = jwt.sign({ user: { id: user.id, name: user.name, username: user.username, email: user.email } }, process.env.JWT_SECRET);
        res.json({ user, token });
    } catch (err) {
        console.error(err.message);
        res.status(401).json({ message: err.message });
    }
});

// Route for user login
router.post('/login', ensureNotLoggedIn, async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        // Create JWT token for authentication
        const token = jwt.sign({ user: { id: user.id, name: user.name, username: user.username, email: user.email } }, process.env.JWT_SECRET);

        res.json({ user, token });
    } catch (err) {
        console.error(err.message);
        res.status(401).json({ message: err.message });
    }
});

module.exports = router;
