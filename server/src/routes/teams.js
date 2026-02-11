const express = require('express');
const router = express.Router();
const prisma = require('../db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

// Team Registration
router.post('/register', async (req, res) => {
    const { name, contactEmail, isSeasonal, players } = req.body;
    try {
        const team = await prisma.team.create({
            data: {
                name,
                contactEmail,
                isSeasonal: !!isSeasonal,
                players: {
                    create: players.map(p => ({ name: p }))
                }
            },
            include: { players: true }
        });

        const token = jwt.sign({ id: team.id, role: 'team' }, JWT_SECRET);
        res.status(201).json({ team, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all teams (Admin)
router.get('/', async (req, res) => {
    try {
        const teams = await prisma.team.findMany({ include: { players: true } });
        res.json(teams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get team by ID
router.get('/:id', async (req, res) => {
    try {
        const team = await prisma.team.findUnique({
            where: { id: req.params.id },
            include: { players: true, scores: true }
        });
        res.json(team);
    } catch (error) {
        res.status(404).json({ error: 'Team not found' });
    }
});

module.exports = router;
