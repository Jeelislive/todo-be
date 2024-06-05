

const mongoose = require('mongoose');

connectDB = () => {
    mongoose
        .connect(process.env.MONGO_URL,
            { useNewUrlParser: true, useUnifiedTopology: true })
        .then(
            console.log(`Connected to the database`)
        )
        .catch((err) => {
            console.error('Error connecting to the database:', err.message);
        });
};

module.exports = connectDB;

