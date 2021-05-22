const User = require('../model/user');

async function userToAddress(userid) {
    if (userid.startsWith('0x')) {
        return userid;
    }
    var user = await User.findOne({ name: userid });
    if (user == null) return '';

    return user.address;
}

module.exports = {
    userToAddress: userToAddress,
};
