
// Import Express
const express = require("express");
const app = express();

// Middleware to parse JSON data
app.use(express.json());

// GET request
app.get("/hello", (req, res) => {
  res.status(200).send("Hello via GET request");
});

// POST request
app.post("/hello", (req, res) => {
  res.status(201).send("Hello via POST request");
});

// Start the server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});
