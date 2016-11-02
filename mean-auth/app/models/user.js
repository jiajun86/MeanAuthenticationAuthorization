(function () {
    'use strict';

    var bcrypt = require('bcryptjs'),
        mongoose = require('mongoose'),
        mongooseRole = require('mongoose-role');

    var Schema = mongoose.Schema,
        userSchema = new Schema({
            email: {
                type: String,
                required: true,
                unique: true
            },
            password: {
                type: String,
                required: true
            },
            name: String,
            phone: String
        }, {
            timestamps: true
        });

    userSchema.plugin(mongooseRole, {
        roles: ['admin', 'user'],
        accessLevels: {
            'profile': ['admin', 'user'],
            'users': ['admin']
        }
    });

    userSchema.methods.generateHash = function (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync());
    };

    userSchema.methods.validPassword = function (password) {
        return bcrypt.compareSync(password, this.password);
    };

    module.exports = mongoose.model('User', userSchema);
})();