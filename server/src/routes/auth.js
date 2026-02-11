const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { ADMIN_PASSWORD, JWT_SECRET } = require('../middleware/auth');

router.post('/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        const token = jwt.sign({ role: 'admin' }, JWT_SECRET);
        return res.json({ token });
    }
    res.status(401).json({ message: 'Invalid password' });
});

module.exports = router;
