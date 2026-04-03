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
                    create: players.map(p => ({
                        name: p.name,
                        email: p.email || null,
                        phone: p.phone || null
                    }))
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

const { adminAuth } = require('../middleware/auth');

// Delete team (Admin)
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Delete related records first to avoid foreign key constraints
        await prisma.score.deleteMany({ where: { teamId: id } });
        await prisma.player.deleteMany({ where: { teamId: id } });
        
        // Delete the team
        await prisma.team.delete({ where: { id } });
        
        res.json({ message: 'Team deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
