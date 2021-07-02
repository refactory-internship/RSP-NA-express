const { User } = require('../../database/models');

class profileController {
    static async getUserProfile(req, res) {
        //fetch user's id from payload from jwt verification middleware
        await User.findByPk(req.user.id).then((user) => {
            res.status(200).json(user);
        });
    }

}

module.exports = profileController;