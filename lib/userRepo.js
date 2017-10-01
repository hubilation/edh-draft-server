'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.listAll = listAll;
exports.createUser = createUser;
exports.getUser = getUser;

var _user = require('./model/user');

var _user2 = _interopRequireDefault(_user);

var _jsMd = require('js-md5');

var _jsMd2 = _interopRequireDefault(_jsMd);

var _dbUtilities = require('./dbUtilities');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function listAll() {
    _user2.default.find({}, function (err, users) {
        console.log(users);
    });
}

function createUser(userName, email, password) {
    var newUser = new _user2.default({
        email: email,
        password: (0, _jsMd2.default)(password),
        userName: userName
    });

    newUser.save(function (err) {

        if (err) {
            console.log((0, _dbUtilities.handleErrors)(err));
            return;
        }

        console.log("user created");
    });
}

function getUser(email) {
    _user2.default.findOne({ email: email }, function (err, user) {
        console.log(user);
    });
}