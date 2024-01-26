const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        name: {required: true, type: String},
        email: {required: true, type: String, unique: true},
        password: {required: true, type: String}
    },
    {timestamps: true}
);

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
