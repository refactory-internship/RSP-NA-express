const jwt = require('jsonwebtoken');
const { User } = require('../database/models');
require('dotenv').config();

const accessKey = process.env.ACCESS_KEY_SECRET;

verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({
            message: 'You need to login first!'
        });
    }

    jwt.verify(token, accessKey, (err, user) => {
        if (err) {
            return res.status(403).json({
                message: 'Token invalid!'
            });
        }
        req.user = user;
        next();
    });
}

isAdmin = (req, res, next) => {
    User.findOne({
        where: { id: req.user.id },
        include: 'Role'
    }).then((user) => {
        if (user.Role.name === 'Admin') {
            return next();
        } else {
            return res.status(403).json({
                message: 'Forbidden! You are a ' + user.Role.name
            });
        }
    });
}

const authJWT = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
}

module.exports = authJWT;