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

// Publish scores (trigger a visual update on displays and send emails)
router.post('/week/:weekId/publish', adminAuth, async (req, res) => {
    const weekId = req.params.weekId;
    
    // Broadcast via socket
    req.io.to(`week_${weekId}`).emit('scores_published');

    res.json({ message: 'Scores published, sending emails in background...' });

    // Background task: send emails
    try {
        const { sendScorePublishedEmail } = require('../utils/email');
        
        // Fetch the week to get its number
        const week = await prisma.week.findUnique({ where: { id: weekId } });
        if (!week) return;

        // Fetch all scores for this week
        const allScores = await prisma.score.findMany({
            where: { weekId },
            include: { team: true }
        });

        // Group by team to calculate total points
        const teamScores = {};
        allScores.forEach(score => {
            const team = score.team;
            if (!teamScores[team.id]) {
                teamScores[team.id] = { team, totalPoints: 0 };
            }
            teamScores[team.id].totalPoints += score.points;
        });

        const liveUrl = `https://trivia.cultivatedcocktails.com/live`;

        // Send out an email to each team
        for (const { team, totalPoints } of Object.values(teamScores)) {
            if (team.contactEmail) {
                await sendScorePublishedEmail(
                    team.contactEmail,
                    team.name,
                    week.weekNumber,
                    totalPoints,
                    liveUrl
                );
            }
        }
    } catch (err) {
        console.error('Error during post-publish email processing:', err);
    }
});

module.exports = router;
