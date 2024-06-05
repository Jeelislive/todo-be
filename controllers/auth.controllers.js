const User = require("../models/user")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs')

const register =  async (req, res) => {
    try {
        //get all data from body
        const { firstname, lastname, email, password } = req.body

        //all the data should exist
        if (!(firstname && lastname && email && password)) {
            res.send(400).send("all feilds are complosory")
        }

        //check if user already exist
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            res.status(401).send("user is already exist")
        }
        //encrypt the password
        const hashpassword = await bcrypt.hash(password, 10)

        //save the user in the db
        const user = await User.create({
            firstname,
            lastname,
            email,
            password: hashpassword
        })

        //generate the tokens for the user and send it
        const token = jwt.sign(
            { id: user._id, email },
            process.env.jwtsecret,
            {
                expiresIn: "1h"
            }
        );

        user.token = token
        user.password = undefined

        res.status(200).json(user)

    } catch (error) {
        console.log(error);
    }
}

const login = async (req, res) => {
    try {
        //get all daata from the fronend
        const { email, password } = req.body;

        //validation
        if (!(email && password)) {
            res.status(400).send("Email and password not found");
        }

        //find the user in the db
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).send("User not found in the database");
        }

        //match the password
        const matchedpass = await bcrypt.compare(password, user.password);
        if (user && matchedpass) {
            const token = jwt.sign(
                { id: user._id },
                process.env.jwtsecret,
                {
                    expiresIn: "1h"
                }
            );

            // Cookie Section:
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 1000),
                httpOnly: true
            };

            // Send a single Response (with the token):
            res.status(200).cookie("token", token, options).json({
                success: true,
                token,
                user: {
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email
                }
            });
        } else {
            res.status(401).send("Incorrect email or password");
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const dashboard = async (req, res) => {
    try {
        res.status(200).json({
            status: "success",
            message: "Get Profile Successfully",
            data: {
                firstname: req.user.firstname,
                email: req.user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error.message
        });
    }
}

const logout = async (req, res) => {
    try {
        // Clear the cookie on the client-side
        res.clearCookie('token');

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = { register, login, dashboard , logout}