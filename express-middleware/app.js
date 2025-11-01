
const express = require("express");
const app = express();

// Middleware 1: JSON body parser
app.use(express.json());

// Middleware 2: Custom logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // Pass control to the next middleware/route
});

// Sample GET route
app.get("/", (req, res) => {
  res.send("Welcome to Middleware Example");
});

// Sample POST route to test JSON body parsing
app.post("/data", (req, res) => {
  res.json({
    message: "Data received successfully",
    yourData: req.body,
  });
});

// Start server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});
