const bcrypt = require('bcrypt');
const { sendMail } = require('../../config/transporter');
const crypto = require('crypto');
const cloudinary = require('../../config/cloudinary');
const Queue = require('bull');
const path = require('path');

//load user model
const { User, Token, PhotoUsers } = require('../../database/models');
//load input validation
const validateRegisterInput = require('../../validations/register');

class registerController {
    static async register(req, res, next) {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'Photo field required!' });
            }

            if (req.file) {
                const maxSize = 1 * 1024 * 1024;
                const ext = path.extname(req.file.originalname);

                if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
                    return res.status(400).json({ message: 'File type is not supported!' });
                }

                if (req.file.size >= maxSize) {
                    return res.status(400).json({ message: 'Your photo cannot be bigger than 1 MB' })
                }
            }

            //form validation
            const { errors, isValid } = validateRegisterInput(req.body);

            //check validation
            if (!isValid) {
                return res.status(400).json(errors);
            }

            await User.create({
                RoleId: 2,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 10),
                username: req.body.username,
                isActive: false
            }).then((user) => {
                //generate token for newly registered user
                const newToken = crypto.randomBytes(10).toString('hex');
                const username = req.body.username

                Token.create({
                    email: user.email,
                    token: newToken
                }).then((token) => {
                    const data = {
                        email: user.email,
                        id: user.id,
                        token: token.token
                    }

                    const sendMailQueue = new Queue(`sendMailTo${user.username}`, {
                        redis: {
                            host: '127.0.0.1',
                            port: 6379
                        }
                    });

                    sendMailQueue.add(data);
                    sendMailQueue.process(async job => {
                        return await sendMail(job.data.id, job.data.email, job.data.token);
                    });
                }).catch((error) => {
                    res.status(400).json(error);
                });

                cloudinary.uploader.upload(req.file.path, {
                    folder: 'rsp-notesApp/users/',
                    public_id: username + '_' + user.id + '_' + 'notesApp',
                    overwrite: true
                }).then((result) => {
                    PhotoUsers.create({
                        UserId: user.id,
                        cloudinary_public_id: result.public_id,
                        cloudinary_secure_url: result.secure_url
                    });
                }).catch((error) => {
                    res.status(400).json(error);
                });
            }).catch((error) => {
                res.status(400).json(error);
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