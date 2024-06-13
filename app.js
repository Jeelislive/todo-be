require('dotenv').config();
const express = require('express');
const connectDB = require('./db/connectDB')
const User = require('./models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const userController = require('./controllers/auth.controllers')
const middleware = require('./middlewares/middle.js')

const app = express();
app.use(express.json());
app.use(cookieParser());


app.use(cors({
  origin: 'https://todo-fe-mu.vercel.app',
  credentials: true
}));

connectDB();

app.post("/api/login", userController.login);
app.post("/api/register", userController.register);
app.get("/api/logout", userController.logout)
app.get("/dashboard", middleware.authMiddleware, userController.dashboard)


const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("<h1>App is working</h1>");
});

app.listen(PORT, () => {
  console.log(`App is listening on ${ PORT }`);
});
