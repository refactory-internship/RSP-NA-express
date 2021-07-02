const bcrypt = require('bcrypt');
const { User } = require('../../database/models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//load access secret key from env
const accessKey = process.env.ACCESS_KEY_SECRET;

//load input validation
const validateEmailloginInput = require('../../validations/loginWithEmail');
const validateUsernameLoginInput = require('../../validations/loginWithUsername');

class loginController {
    static async loginWithUsername(req, res) {
        //form validation
        const { errors, isValid } = validateUsernameLoginInput(req.body);

        //check validation
        if (!isValid) {
            return res.status(400).json(errors);
        }

        //find user by username
        await User.findOne({
            where: {
                username: req.body.username
            },
            include: 'Role'
        }).then((user) => {
            //check if user exists
            if (!user) {
                return res.status(400).json({
                    message: 'Username not found!'
                });
            }

            if (user.isActive === false) {
                return res.status(401).json({
                    message: 'Please verify your email!'
                });
            }

            bcrypt.compare(req.body.password, user.password)
                .then((isMatch) => {
                    if (isMatch) {
                        //user matched
                        //create JWT payload
                        jwt.sign({ id: user.id }, accessKey, { expiresIn: 60 * 60 }, (err, token) => {
                            res.status(200).json({
                                token: token,
                                id: user.id,
                                email: user.email,
                                username: user.username,
                                photo: user.photo,
                                role: user.Role.name
                            });
                        });
                    } else {
                        return res.status(400).json({
                            message: 'Password Incorrect!'
                        });
                    }
                });
        });
    }

    static async loginWithEmail(req, res) {
        //form validation
        const { errors, isValid } = validateEmailloginInput(req.body);

        //check validation
        if (!isValid) {
            return res.status(400).json(errors);
        }

        //find user by email
        await User.findOne({
            where: {
                email: req.body.email
            },
            include: 'Role'
        }).then((user) => {
            //check if user exists
            if (!user) {
                return res.status(400).json({
                    message: 'Email not found!'
                });
            }

            if (user.isActive === false) {
                return res.status(401).json({
                    message: 'Please verify your email!'
                });
            }

            bcrypt.compare(req.body.password, user.password)
                .then((isMatch) => {
                    if (isMatch) {
                        jwt.sign({ id: user.id }, accessKey, { expiresIn: 60 * 60 }, (err, token) => {
                            res.status(200).json({
                                token: token,
                                id: user.id,
                                email: user.email,
                                username: user.username,
                                photo: user.photo,
                                role: user.Role.name
                            });
                        });
                    } else {
                        return res.status(400).json({
                            message: 'Password Incorrect!'
                        });
                    }
                });
        });
    }
}

module.exports = loginController;