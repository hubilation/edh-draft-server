import passport from 'passport';
import { LocalStrategy } from 'passport-local';
import { Strategy } from "passport-local";
import User from './model/user';
import md5 from 'js-md5';

export function configurePassport(){
    passport.use(
        new Strategy(function (username, password, done) {
            User.findOne({userName:username}, (err, user)=>{
                if(user){
                    var hashedPassword = md5(password);
                    if(user.password === hashedPassword){
                        return done(null, user);
                    }
                    return done("Password invalid.");

                }else{
                    return done("User does not exist");
                }
            });
        })
    );
    
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function (id, done) {
        User.findById(id, (err, user)=>{
            done(null, user);
        })
    });
}


// passport.use(new LocalStrategy(
//     function(username, password, done){
//         console.log("login attempt");
//         return done(null, {email:"test", name:"steve"});
//     }
// ))

