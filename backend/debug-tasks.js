const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Task = require('./models/Task');

dotenv.config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const latestTasks = await Task.find({}).sort({ createdAt: -1 }).limit(5);
        console.log("================================");
        console.log("Latest Tasks in DB:");
        latestTasks.forEach(t => {
            console.log(`- Title: ${t.title}, DueDate: ${t.dueDate ? t.dueDate : 'MISSING'}`);
        });
        console.log("================================");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkDB();
