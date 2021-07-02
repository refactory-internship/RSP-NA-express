const { Note } = require('../../database/models');

class noteController {
    static async index(req, res) {
        const notes = await Note.findAll();
        res.status(200).json(notes);
    }

    static async destroy(req, res) {
        await Note.destroy({
            where: {
                id: req.params.id
            }, force: true
        }).then(() => {
            res.status(200).json({ message: 'Note taken down!' });
        }).catch((error) => {
            res.status(400).json(error);
        });
    }

    static async restore(req, res) {
        await Note.restore({
            where: {
                id: req.params.id
            }
        }).then((note) => {
            res.status(200).json({
                message: 'Note restored successfuly',
                note
            });
        }).catch((error) => {
            res.status(400).json(error);
        });
    }
}

module.exports = noteController