const User = require('../model/user');
const Safe = require('../model/safe');
const caver = require('caver-js');

async function userToAddress(userid) {
    if (userid.startsWith('0x')) {
        return userid;
    }
    var user = await User.findOne({ name: userid });
    if (user === null) {
        user = await Safe.findOne({ name: userid });
    }
    if (user == null) return '';

    return user.address;
}

async function addressToUser(address) {
    const user = await User.findOne({
        address: caver.utils.toChecksumAddress(address),
    });

    return user === null ? '' : user.name;
}

async function userToAccount(userid) {
    const user = await User.findOne({ name: userid });
    if (user === null) return '';

    return user;
}
module.exports = {
    userToAddress: userToAddress,
    addressToUser: addressToUser,
    userToAccount: userToAccount,
};
