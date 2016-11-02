(function () {
    'use strict';

    var ensureLogin = require('connect-ensure-login');

    module.exports = {
        isSignedIn: function (path) {
            return ensureLogin.ensureLoggedIn(path);
        },
        hasAccess: function (accessLevel) {
            return function (req, res, next) {
                if (req.user && req.user.hasAccess(accessLevel)) {
                    return next();
                }

                return res.render('unauthorized');
            };
        }
    };
})();