const bcrypt = require('bcrypt');
const { sendMail } = require('../../config/transporter');
const crypto = require('crypto');
const cloudinary = require('../../config/cloudinary');

//load user model
const { User, Token } = require('../../database/models');

//load input validation
const validateRegisterInput = require('../../validations/register');
const sendMailQueue = require('../../config/sendMailQueue');
const path = require('path');

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

            const username = req.body.username
            //timestamp
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth();
            const day = now.getDate();
            const date = day + '_' + month + '_' + year;

            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'rsp-notesApp/users/',
                public_id: username + '_' + date,
                overwrite: true
            });

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
                photo: result.secure_url,
                isActive: false
            });

            console.log(result.secure_url);

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