const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

// Use dynamic import for node-fetch
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// OpenAI API parameters
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // The key is picked up from .env file
const MODEL_URL = 'https://api.openai.com/v1/completions'; // OpenAI completions endpoint

// Handle blog generation
app.post('/generate-blog', async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const response = await fetch(MODEL_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "text-davinci-003", // Or GPT-4 if you have access
        prompt: prompt,
        max_tokens: 2000, // Adjust for 1000 words
        temperature: 0.7,
      }),
    });

    const result = await response.json();
    const generatedText = result.choices[0].text;

    if (generatedText) {
      res.json({ success: true, blog: generatedText });
    } else {
      res.json({ success: false, message: 'Failed to generate blog.' });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Error occurred while generating blog.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
