// load thImape things we need
var mongoose = require('mongoose');
var User = require('../models/user');

// define the schema for our user model
var mailboxSchema = mongoose.Schema({
        name: String,
        imap: String,
        smtp: String,
        imapPort: Number,
        smtpPort: Number,
        password: String,
        username: String,
        color: String,
        secure: Boolean,
        type: {type: String, default: 'imap'},
        clientId: String,
        clientSecret: String,
        accessToken: String,
        refreshToken: String,
        googleId: String,
        email: String,

});

// create the model for users and expose it to our app
module.exports = mongoose.model('MailBox', mailboxSchema);
module.googleLoginEnable = false;