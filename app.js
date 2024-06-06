require('dotenv').config();
const express = require('express');
const connectDB = require('./db/connectDB')
const User = require('./models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const userController  = require('./controllers/auth.controllers')


const app = express();
app.use(express.json());
app.use(cookieParser());


app.use(cors({
  origin: 'https://todo-fe-mu.vercel.app',
  credentials: true
}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*', 'https://todo-fe-mu.vercel.app');
  res.setHeader('Access-Control-Allow-Origin', "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

connectDB();


app.get("/", (req, res) => {
  res.send("<h1>App is working</h1>");
});

app.post('/register', userController.register);

app.post('/login', userController.login);

app.get('/dashboard', userController.dashboard); 

app.get('/logout', userController.logout);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App is listening on ${ PORT }`);
});
