
// app.js
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json()); // parse JSON bodies

// --------------------
// 1) Connect to MongoDB
// --------------------
mongoose.connect('mongodb://127.0.0.1:27017/schoolDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  // do not exit here if you want the app to stay up for debug; otherwise process.exit(1);
});

// --------------------
// 2) Student schema & model
// --------------------
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: Number, required: true, unique: true },
  branch: String,
  year: Number,
  email: String
});

const Student = mongoose.model('Student', studentSchema);

// --------------------
// 3) CRUD routes (errors delegated to central handler)
// --------------------

// CREATE
app.post('/students', async (req, res, next) => {
  try {
    const student = new Student(req.body);
    await student.save();
    return res.status(201).json(student); // 201 Created
  } catch (err) {
    next(err);
  }
});

// READ all
app.get('/students', async (req, res, next) => {
  try {
    const students = await Student.find();
    return res.status(200).json(students); // 200 OK
  } catch (err) {
    next(err);
  }
});

// READ by ID
app.get('/students/:id', async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' }); // 404
    return res.status(200).json(student);
  } catch (err) {
    next(err);
  }
});

// UPDATE
app.put('/students/:id', async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // return updated and run schema validators
    );
    if (!student) return res.status(404).json({ error: 'Student not found' });
    return res.status(200).json(student);
  } catch (err) {
    next(err);
  }
});

// DELETE
app.delete('/students/:id', async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    return res.status(200).json({ message: 'Student deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// --------------------
// 4) 404 handler for unknown routes
// --------------------
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// --------------------
// 5) Centralized error-handling middleware
// --------------------
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err);

  // Mongoose validation error => 400 Bad Request
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: 'Validation Error', details: err.message });
  }

  // Mongoose CastError (e.g., invalid ObjectId) => 400 Bad Request
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID format', details: err.message });
  }

  // Duplicate key error => 409 Conflict
  if (err.code && err.code === 11000) {
    return res.status(409).json({ error: 'Duplicate key error', details: err.message });
  }

  // Default: 500 Internal Server Error
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

// --------------------
// 6) Start server
// --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
