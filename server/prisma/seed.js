require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Create Season
    const season = await prisma.season.create({
        data: {
            name: 'Grand Opening Season 2024',
            startDate: new Date(),
            isActive: true,
        }
    });

    // Create Week 1
    const week = await prisma.week.create({
        data: {
            seasonId: season.id,
            weekNumber: 1,
        }
    });

    // Create 5 Rounds for Week 1
    const rounds = [];
    for (let i = 1; i <= 5; i++) {
        const round = await prisma.round.create({
            data: {
                weekId: week.id,
                roundNumber: i,
                maxPoints: 10,
            }
        });
        rounds.push(round);
    }

    // Create some Teams
    const teams = [
        { name: 'The Bourbon Barons', email: 'barons@example.com' },
        { name: 'Gin & Juice Club', email: 'gin@example.com' },
        { name: 'The Rum Rebels', email: 'rum@example.com' }
    ];

    for (const t of teams) {
        const team = await prisma.team.create({
            data: {
                name: t.name,
                contactEmail: t.email,
                isSeasonal: true,
                players: {
                    create: [{ name: 'Player 1' }, { name: 'Player 2' }]
                }
            }
        });

        // Add some random scores for Week 1
        for (const round of rounds) {
            await prisma.score.create({
                data: {
                    weekId: week.id,
                    teamId: team.id,
                    roundId: round.id,
                    points: Math.floor(Math.random() * 11)
                }
            });
        }
    }

    console.log('Seeding complete! 🥃');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
