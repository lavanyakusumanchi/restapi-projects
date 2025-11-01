const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Step 1: Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/schoolDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ Connection error:", err));

// Step 2: Define Schema with Validation
const studentSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Name is required"] },
    rollNo: { type: Number, required: [true, "Roll number is required"], unique: true },
    branch: { type: String, required: [true, "Branch is required"] },
    year: { type: Number, required: [true, "Year is required"] },
    email: { 
        type: String, 
        required: [true, "Email is required"], 
        match: [/\S+@\S+\.\S+/, "Invalid email format"] 
    }
});


// Step 3: Create Model
const Student = mongoose.model("Student", studentSchema);

// Step 4: POST Route to insert student
app.post('/students', async (req, res, next) => {
  try {
    const student = new Student(req.body);
    await student.save();
    return res.status(201).json(student); // 201 Created
  } catch (err) {
    next(err); // send error to middleware
  }
});

// Step 5: Error Handling Middleware
app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    return res.status(400).json({ 
      error: "Validation Error", 
      details: err.message 
    });
  }
  res.status(500).json({ error: "Internal Server Error", details: err.message });
});

// Step 6: Start Server
app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});
