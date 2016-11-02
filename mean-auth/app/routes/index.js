(function () {
    'use strict';

    var auth = require('../auth');

    module.exports = function (app, passport) {
        app.get('/', function (req, res) {
            res.render('index');
        });

        app.get('/about', function (req, res) {
            res.render('about');
        });

        app.get('/contact', function (req, res) {
            res.render('contact');
        });

        app.get('/sign-in', function (req, res) {
            res.render('sign-in', {
                message: getFlashMessage(req.flash('message'))
            });
        });

        app.post('/sign-in', passport.authenticate('local-sign-in', {
            successReturnToOrRedirect: '/home',
            failureRedirect: '/sign-in',
            failureFlash: true
        }));

        app.get('/sign-out', function (req, res) {
            req.logout();
            res.redirect('/');
        });

        app.get('/sign-up', function (req, res) {
            res.render('sign-up', {
                message: getFlashMessage(req.flash('message'))
            });
        });

        app.post('/sign-up', passport.authenticate('local-sign-up', {
            successReturnToOrRedirect: '/home',
            failureRedirect: '/sign-up',
            failureFlash: true
        }));

        app.get('/home', auth.isSignedIn('/sign-in'), function (req, res) {
            res.render('home', {
                user: req.user
            });
        });
    };

    function getFlashMessage(flash) {
        return flash.length > 0 ? flash[0] : "";
    }
})();