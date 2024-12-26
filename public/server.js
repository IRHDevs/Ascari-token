const express = require('express');
const path = require('path');
const app = express();

// Serve everything in the current folder (or 'public' if you prefer)
app.use(express.static(path.join(__dirname)));

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
