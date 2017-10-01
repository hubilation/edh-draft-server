import passport from 'passport';
import { LocalStrategy } from 'passport-local';
import { Strategy } from "passport-local";
import User from './model/user';
import md5 from 'js-md5';

export function configurePassport() {
    passport.use(
        new Strategy({ passReqToCallback: true }, function (req, username, password, done) {
            User.findOne({ userName: username }, (err, user) => {
                if (user) {
                    var hashedPassword = md5(password);
                    if (user.password === hashedPassword) {
                        return done(null, user);
                    }
                    return done(null, false, {message: "Incorrect password"});

                } else {
                    return done(null, false, {message: "User does not exist"});
                }
            });
        })
    );

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });
}


// passport.use(new LocalStrategy(
//     function(username, password, done){
//         console.log("login attempt");
//         return done(null, {email:"test", name:"steve"});
//     }
// ))

