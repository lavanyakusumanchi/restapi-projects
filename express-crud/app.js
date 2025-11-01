
// Import Express
const express = require("express");
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Sample in-memory data
let items = [{ id: 1, name: "item" }];

// GET route - Read items
app.get("/items", (req, res) => {
  res.status(200).json(items);
});

// POST route - Create new item
app.post("/items", (req, res) => {
  const newItem = { id: items.length + 1, name: req.body.name };
  items.push(newItem);
  res.status(201).json(newItem);
});

// PUT route - Update item
app.put("/items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find(i => i.id === id);

  if (item) {
    item.name = req.body.name || item.name;
    res.status(200).json(item);
  } else {
    res.status(404).json({ message: "Item not found" });
  }
});

// DELETE route - Remove item
app.delete("/items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  items = items.filter(i => i.id !== id);
  res.status(200).json({ message: "Item deleted" });
});

// Start the server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});
