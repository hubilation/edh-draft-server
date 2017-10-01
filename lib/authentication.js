'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.configurePassport = configurePassport;

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportLocal = require('passport-local');

var _user = require('./model/user');

var _user2 = _interopRequireDefault(_user);

var _jsMd = require('js-md5');

var _jsMd2 = _interopRequireDefault(_jsMd);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function configurePassport() {
    _passport2.default.use(new _passportLocal.Strategy(function (username, password, done) {
        _user2.default.findOne({ userName: username }, function (err, user) {
            if (user) {
                var hashedPassword = (0, _jsMd2.default)(password);
                if (user.password === hashedPassword) {
                    return done(null, user);
                }
                return done("Password invalid.");
            } else {
                return done("User does not exist");
            }
        });
    }));

    _passport2.default.serializeUser(function (user, done) {
        done(null, user.id);
    });

    _passport2.default.deserializeUser(function (id, done) {
        _user2.default.findById(id, function (err, user) {
            done(null, user);
        });
    });
}

// passport.use(new LocalStrategy(
//     function(username, password, done){
//         console.log("login attempt");
//         return done(null, {email:"test", name:"steve"});
//     }
// ))