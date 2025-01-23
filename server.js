const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Feedback = require('./models/feedback'); // Renamed for clarity

const app = express();
const port = 3000;

mongoose
  .connect('mongodb://localhost:27017/coderone')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Corrected folder for static files

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html'); // Corrected path
});

app.post('/submit-feedback', async (req, res) => {
  const { name, contactNumber, email, feedback: feedbackText } = req.body;
  const feedback = new Feedback({
    name,
    contactNumber,
    email,
    feedback: feedbackText,
  });

  try {
    await feedback.save();
    console.log('Feedback Saved Successfully');
    res.send(`
        <html>
            <head>
                <title>Feedback</title>
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f9; margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh;">
    <div style="text-align: center; background: #ffffff; padding: 20px 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <h1 style="color: #4caf50; font-size: 2rem; margin-bottom: 10px;">Thank You!</h1>
        <p style="color: #555; font-size: 1.1rem; margin-bottom: 20px;">Your feedback has been successfully submitted.</p>
        <a href="/" style="text-decoration: none; background-color: #4caf50; color: white; padding: 10px 20px; border-radius: 5px; font-size: 1rem; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">Go Back to Form</a>
    </div>
</body>

        </html>
    `);
  } catch (err) {
    console.error('Error Saving feedback:', err);
    res.status(500).send('There was an error in submitting your feedback.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
