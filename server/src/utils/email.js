const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const sendScorePublishedEmail = async (contactEmail, teamName, weekNumber, totalScore, liveUrl) => {
    if (!contactEmail) return;

    try {
        const mailOptions = {
            from: `"Distillery Trivia" <${process.env.SMTP_USER}>`,
            to: contactEmail,
            subject: `Scores are up for Week ${weekNumber}! 🥃`,
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #1a1a1a; color: #fff; padding: 2rem;">
                    <h2>Cheers, ${teamName}!</h2>
                    <p>The scores for Week ${weekNumber} have just been published.</p>
                    <p style="font-size: 1.5rem; color: #c18b5c;"><strong>Your Team Score: ${totalScore}</strong></p>
                    <br/>
                    <p>Check out the full live leaderboard here:</p>
                    <a href="${liveUrl}" style="background-color: #c18b5c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Live Standings</a>
                    <br/><br/>
                    <p>Thanks for playing!<br/><em>Cultivated Cocktails</em></p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${contactEmail}`);
    } catch (error) {
        console.error('Error sending email:', error.message);
    }
};

module.exports = { sendScorePublishedEmail };
