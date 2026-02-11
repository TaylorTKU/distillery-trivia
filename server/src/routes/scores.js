const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { adminAuth } = require('../middleware/auth');

// Upsert score (Admin/Host)
router.post('/', adminAuth, async (req, res) => {
    const { weekId, teamId, roundId, points } = req.body;
    try {
        const score = await prisma.score.upsert({
            where: {
                weekId_teamId_roundId: { weekId, teamId, roundId }
            },
            update: { points },
            create: { weekId, teamId, roundId, points }
        });

        // Broadcast update via socket
        req.io.to(`week_${weekId}`).emit('score_updated', score);

        res.json(score);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get scores for a week
router.get('/week/:weekId', async (req, res) => {
    try {
        const scores = await prisma.score.findMany({
            where: { weekId: req.params.weekId },
            include: { team: true, round: true }
        });
        res.json(scores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Publish scores (trigger a visual update on displays)
router.post('/week/:weekId/publish', adminAuth, async (req, res) => {
    req.io.to(`week_${req.params.weekId}`).emit('scores_published');
    res.json({ message: 'Scores published' });
});

module.exports = router;
