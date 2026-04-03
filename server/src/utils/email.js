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
                <div style="font-family: Arial, sans-serif; background-color: #ffffff; color: #333333; padding: 2rem; border: 1px solid #eaeaea; border-radius: 8px; max-width: 600px; text-align: center;">
                    <img src="https://trivia.cultivatedcocktails.com/logo.png" alt="Cultivated Cocktails" style="max-height: 80px; margin-bottom: 1.5rem;" />
                    <h2 style="color: #1a1a1a;">Cheers, ${teamName}!</h2>
                    <p>The scores for Week ${weekNumber} have just been published.</p>
                    <div style="background-color: #f9f9f9; padding: 1.5rem; margin: 1.5rem 0; border-radius: 8px; border: 1px solid #eee;">
                        <p style="font-size: 1.5rem; margin: 0; color: #c18b5c;"><strong>Your Team Score: ${totalScore}</strong></p>
                    </div>
                    <p>Check out the full live leaderboard here:</p>
                    <a href="${liveUrl}" style="background-color: #c18b5c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block; margin-top: 1rem;">View Live Standings</a>
                    <br/><br/>
                    <hr style="border: none; border-top: 1px solid #eaeaea; margin: 2rem 0;" />
                    <p style="color: #888; font-size: 0.9rem;">Thanks for playing!<br/><em>Cultivated Cocktails</em></p>
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
