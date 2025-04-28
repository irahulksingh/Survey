const express = require('express');
const fs = require('fs-extra');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const RESULTS_FILE = path.join(__dirname, 'results.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public//'));

// Load or initialize results
let results = {};
if (fs.existsSync(RESULTS_FILE)) {
  results = fs.readJsonSync(RESULTS_FILE);
}

// Save results to file
function saveResults() {
  fs.writeJsonSync(RESULTS_FILE, results, { spaces: 2 });
}

// Routes
app.post('/submit', (req, res) => {
  const answers = req.body;

  Object.keys(answers).forEach(question => {
    if (!results[question]) {
      results[question] = {};
    }
    Object.keys(answers[question]).forEach(option => {
      const score = parseInt(answers[question][option]);
      results[question][option] = (results[question][option] || 0) + score;
    });
  });

  saveResults();
  res.json({ message: 'Svar inskickat!' });
});

app.get('/results', (req, res) => {
  res.json(results);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
