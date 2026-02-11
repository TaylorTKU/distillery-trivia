const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { adminAuth } = require('../middleware/auth');

// Get all seasons
router.get('/', async (req, res) => {
    try {
        const seasons = await prisma.season.findMany({
            include: { weeks: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(seasons);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new season
router.post('/', adminAuth, async (req, res) => {
    const { name, startDate, endDate } = req.body;
    try {
        const season = await prisma.season.create({
            data: { name, startDate: new Date(startDate), endDate: endDate ? new Date(endDate) : null }
        });
        res.status(201).json(season);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Set active season
router.put('/:id/activate', adminAuth, async (req, res) => {
    try {
        await prisma.season.updateMany({ data: { isActive: false } });
        const season = await prisma.season.update({
            where: { id: req.params.id },
            data: { isActive: true }
        });
        res.json(season);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
