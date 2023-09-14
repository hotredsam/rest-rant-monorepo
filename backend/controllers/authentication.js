const router = require('express').Router();
const db = require("../models");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import the jsonwebtoken package
require('dotenv').config(); // Import environment variables

const { User } = db;

router.post('/', async (req, res) => {
    let user = await User.findOne({
        where: { email: req.body.email }
    });

    if (!user || !await bcrypt.compare(req.body.password, user.passwordDigest)) {
        res.status(404).json({
            message: `Could not find a user with the provided username and password`
        });
    } else {
        // Generate a token
        const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ user, token }); // Send token along with user data
    }
});

router.get('/profile', async (req, res) => {
    try {
        // Split the authorization header into [ "Bearer", "TOKEN" ]:
        const [authenticationMethod, token] = req.headers.authorization.split(' ');

        // Only handle "Bearer" authorization for now 
        if (authenticationMethod === 'Bearer') {
            // Decode the JWT
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get the logged in user's id from the payload
            const { userId } = decoded;

            // Find the user object using their id:
            let user = await User.findOne({
                where: {
                    userId: userId
                }
            });
            res.json(user);
        }
    } catch (err) {
        res.json(null);
    }
});

module.exports = router;
