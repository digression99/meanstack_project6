// there's several development configuration. You can make another folder and apply it.
const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
    db : 'meanstack_project6',
    uri : 'mongodb://localhost:27017/meanstack_project6',
    secret : crypto
};