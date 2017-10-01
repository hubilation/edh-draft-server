import User from './model/user';
import md5 from 'js-md5';
import {handleErrors} from './dbUtilities';

export function listAll(){
    User.find({}, (err,users)=>{
        console.log(users);
    });
}

export function createUser(userName, email, password){
    var newUser = new User({
        email: email,
        password: md5(password),
        userName: userName
    });


    newUser.save((err)=>{

        if(err){
            console.log(handleErrors(err));
            return;
        }

        console.log("user created");
    });
}

export function getUser(email){
    User.findOne({email:email}, (err,user)=>{
        console.log(user);
    });
}
