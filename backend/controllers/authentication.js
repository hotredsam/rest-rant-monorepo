const express = require('express');
const router = express.Router();
const db = require("../models");
const bcrypt = require('bcrypt');

const { User } = db;

// GET profile route
router.get('/profile', async (req, res) => {
    console.log(req.session.userId); // Logging the userId from session
    try {
        let user = await User.findOne({
            where: {
                userId: req.session.userId // Using userId from session to find the user
            }
        });
        res.json(user);
    } catch {
        res.json(null);
    }
});

// POST login route
router.post('/', async (req, res) => {
    let user = await User.findOne({
        where: { email: req.body.email }
    });

    if (!user || !await bcrypt.compare(req.body.password, user.passwordDigest)) {
        res.status(404).json({
            message: `Could not find a user with the provided username and password`
        });
    } else {
        req.session.userId = user.userId;  // New line to set the session
        res.json({ user });
    }
});

module.exports = router;
