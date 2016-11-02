(function () {
    'use strict';

    var express = require('express');

    var User = require('../models/user'),
        auth = require('../auth');

    var router = express.Router();

    router.get('/', auth.isSignedIn('/sign-in'), auth.hasAccess('profile'), function (req, res, next) {
        res.render('profile', {
            user: req.user
        });
    });

    router.post('/:id', function (req, res, next) {
        User.findById(req.params.id, function (err, user) {
            if (err) {
                res.send(err);
            }

            var password = req.body.password,
                role = req.body.role;

            if (password && password.length > 0) {
                user.password = password;
            }

            user.name = req.body.name;
            user.phone = req.body.phone;

            if (role && role.length > 0) {
                user.role = role;
            }

            user.save(function (err) {
                if (err) {
                    res.send(err);
                }

                res.render('profile', {
                    user: user
                });
            });
        });
    });

    module.exports = router;
})();