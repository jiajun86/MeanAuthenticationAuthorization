(function () {
    'use strict';

    var LocalStrategy = require('passport-local').Strategy;

    var User = require('../app/models/user');

    module.exports = function (passport) {
        passport.serializeUser(function (user, done) {
            done(null, user.id);
        });

        passport.deserializeUser(function (id, done) {
            User.findById(id, function (err, user) {
                done(err, user);
            });
        });

        passport.use('local-sign-in', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        }, function (req, email, password, done) {
            process.nextTick(function () {
                User.findOne({
                    email: email
                }, function (err, user) {
                    if (err) return done(err);

                    if (!user) return done(null, false, req.flash('message', 'E-mail and/or password is invalid.'));

                    if (!user.validPassword(password)) return done(null, false, req.flash('message', 'E-mail and/or password is invalid.'));

                    else return done(null, user);
                });
            });
        }));

        passport.use('local-sign-up', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        }, function (req, email, password, done) {
            process.nextTick(function () {
                if (!req.user) {
                    User.findOne({
                        email: email
                    }, function (err, user) {
                        if (err) return done(err);

                        if (user) {
                            return done(null, false, req.flash('message', 'E-mail is not available.'));
                        } else {
                            var user = new User();

                            user.email = email;
                            user.password = user.generateHash(password);
                            user.name = req.body.name;
                            user.phone = req.body.phone;
                            user.role = req.body.role;
                            user.save(function (err) {
                                if (err) return done(err);

                                return done(null, user);
                            });
                        }
                    });
                } else if (!req.user.email) {
                    User.findOne({
                        email: email
                    }, function (err, user) {
                        if (err) return done(err);

                        if (user) {
                            return done(null, false, req.flash('message', 'E-mail is not available.'));
                        } else {
                            var user = req.user;

                            user.email = email;
                            user.password = user.generateHash(password);
                            user.name = req.body.name;
                            user.phone = req.body.phone;
                            user.role = req.body.role;
                            user.save(function (err) {
                                if (err) return done(err);

                                return done(null, user);
                            });
                        }
                    });
                } else {
                    return done(null, req.user);
                }
            });
        }));
    };
})();