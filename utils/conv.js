const User = require('../model/user');
const caver = require('caver-js');

async function userToAddress(userid) {
    const user = await User.findOne({ name: userid });
    if (user === null) return '';

    return user.address;
}

async function addressToUser(address) {
    const user = await User.findOne({
        address: caver.utils.toChecksumAddress(address),
    });

    return user === null ? '' : user.name;
}

module.exports = {
    userToAddress: userToAddress,
    addressToUser: addressToUser,
};
