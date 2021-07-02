const bcrypt = require('bcrypt');
const { sendMail } = require('../../config/transporter');
const crypto = require('crypto');

//load user model
const { User, Token } = require('../../database/models');

//load input validation
const validateRegisterInput = require('../../validations/register');
const sendMailQueue = require('../../config/sendMailQueue');

class registerController {
    static async register(req, res, next) {
        try {
            //form validation
            const { errors, isValid } = validateRegisterInput(req.body);
            //generate token for newly registered user
            const newToken = crypto.randomBytes(10).toString('hex');

            //check validation
            if (!isValid) {
                return res.status(400).json(errors);
            }

            const user = await User.create({
                RoleId: 2,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 10),
                username: req.body.username,
                photo: req.body.photo,
                isActive: false
            });

            const token = await Token.create({
                email: user.email,
                token: newToken
            });

            const data = {
                email: user.email,
                id: user.id,
                token: token.token
            }

            sendMailQueue.add(data);

            sendMailQueue.process(async job => {
                return await sendMail(job.data.id, job.data.email, job.data.token)
            });

            res.status(201).json({
                message: 'A new user has been registered successfully'
            });
        } catch (error) {
            if (error.message === 'Validation error') {
                return res.status(400).json({
                    message: 'Email or username already exists!'
                })
            } else {
                next(error);
            }
        }
    }
}

module.exports = registerController;