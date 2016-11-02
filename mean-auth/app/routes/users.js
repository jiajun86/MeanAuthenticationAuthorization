(function () {
    'use strict';

    var express = require('express');

    var User = require('../models/user'),
        auth = require('../auth');

    var router = express.Router();

    router.get('/', auth.isSignedIn('/sign-in'), auth.hasAccess('users'), function (req, res) {
        User.find(function (err, users) {
            if (err) {
                res.send(err);
            }

            res.render('users', {
                user: req.user,
                users: users
            });
        });
    });

    module.exports = router;
})();