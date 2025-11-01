
// Import the http module
const http = require("http");

// Create a server
const server = http.createServer((req, res) => {
  res.statusCode = 200; // HTTP status OK
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello REST API");
});

// Server listens on port 3000
server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});
