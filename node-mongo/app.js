const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// Step 1: Connect to MongoDB (local or Atlas)
mongoose.connect("mongodb://127.0.0.1:27017/mydb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ Error connecting to MongoDB:", err));

// Step 2: Define schema and model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model("User", userSchema);

// Step 3: Create routes

// GET - fetch all users
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// POST - add new user
app.post("/users", async (req, res) => {
  const newUser = new User(req.body);
  await newUser.save();
  res.status(201).json(newUser);
});

// Start server
app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000/");
});
