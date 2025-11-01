// Step 1: Import mongoose
const mongoose = require('mongoose');

// Step 2: Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/schoolDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ Connection error:", err));

// Step 5: Create Student Schema
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rollNo: { type: Number, required: true, unique: true },
    branch: String,
    year: Number,
    email: String
});

// Create Model
const Student = mongoose.model('Student', studentSchema);

// Step 6: Insert Records
const students = [
    { name: "Lavanya Kusumanchi", rollNo: 101, branch: "CSE", year: 3, email: "lavanya@example.com" },
    { name: "Ravi Kumar", rollNo: 102, branch: "ECE", year: 2, email: "ravi@example.com" },
    { name: "Priya Sharma", rollNo: 103, branch: "IT", year: 4, email: "priya@example.com" }
];

// Insert into DB
Student.insertMany(students)
.then(() => {
    console.log("✅ Students inserted successfully");
    mongoose.connection.close(); // Close DB connection after insert
})
.catch(err => console.error("❌ Error inserting students:", err));
