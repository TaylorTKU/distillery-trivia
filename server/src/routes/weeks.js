const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { adminAuth } = require('../middleware/auth');

// Get all weeks for a season
router.get('/season/:seasonId', async (req, res) => {
    try {
        const weeks = await prisma.week.findMany({
            where: { seasonId: req.params.seasonId },
            include: { rounds: true },
            orderBy: { weekNumber: 'asc' }
        });
        res.json(weeks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new week
router.post('/', adminAuth, async (req, res) => {
    const { seasonId, weekNumber } = req.body;
    try {
        const week = await prisma.week.create({
            data: { seasonId, weekNumber: parseInt(weekNumber) }
        });
        res.status(201).json(week);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Add round to week
router.post('/:id/rounds', adminAuth, async (req, res) => {
    const { roundNumber, maxPoints } = req.body;
    try {
        const round = await prisma.round.create({
            data: { weekId: req.params.id, roundNumber, maxPoints }
        });
        res.status(201).json(round);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
