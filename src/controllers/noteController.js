const { Note } = require('../database/models');

class noteController {
    static async index(req, res) {
        const notes = await Note.findAll({
            where: {
                UserId: req.user.id,
                isSecret: false
            }
        });
        res.status(200).json(notes);
    }

    static async show(req, res) {
        const note = await Note.findByPk(req.params.id);

        if (note && note.UserId !== req.user.id) {
            return res.status(403).json({ message: 'You are forbidden to access this record!' });
        }

        if (note && note.isSecret === true) {
            if (!req.body.password) {
                return res.status(400).json({ message: 'Password must be provided to access this note!' });
            } else if (req.body.password !== note.password) {
                return res.status(400).json({ message: 'Password does not match!' });
            }
        }

        res.status(200).json(note);
    }

    static async store(req, res) {
        let isSecret = Boolean;

        if (req.body.password) {
            isSecret = true;
        } else {
            isSecret = false;
        }

        await Note.create({
            UserId: req.user.id,
            title: req.body.title,
            body: req.body.body,
            password: req.body.password,
            type: req.body.type,
            isSecret: isSecret
        }).then((note) => {
            res.status(201).json({
                message: 'Note created successfully',
                note
            });
        }).catch((error) => {
            res.status(400).json(error);
        });
    }

    static async update(req, res) {
        let isSecret = Boolean;

        if (req.body.password) {
            isSecret = true;
        } else {
            isSecret = false;
        }

        const note = await Note.findByPk(req.params.id);
        if (note && note.UserId !== req.user.id) {
            return res.status(403).json({ message: 'You are forbidden to access this record!' });
        }

        note.update({
            title: req.body.title,
            body: req.body.body,
            password: req.body.password,
            type: req.body.type,
            isSecret: isSecret
        }, {
            where: {
                id: req.params.id
            }
        }).then(() => {
            res.status(200).json({
                message: 'Note updated successfully',
            });
        }).catch((error) => {
            res.status(400).json(error);
        });
    }

    static async destroy(req, res) {
        const note = await Note.findByPk(req.params.id);

        if (note && note.UserId !== req.user.id) {
            return res.status(403).json({ message: 'You are forbidden to delete this record!' });
        }

        if (note && note.isSecret === true) {
            if (!req.body.password) {
                return res.status(400).json({ message: 'Password must be provided for deletion!' });
            } else if (req.body.password !== note.password) {
                return res.status(400).json({ message: 'Password does not match!' });
            }
        }

        note.destroy().then(() => {
            res.status(200).json({ message: 'Note deleted!' });
        }).catch((error) => {
            res.status(400).json(error);
        });
    }
}

module.exports = noteController;