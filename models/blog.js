const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise; // what is this??

// I don't actually have to use this, but
// just an example for Schema validation.
let emailLengthChecker = (email) => {
    if (!email) return false;
    if (email.length < 5 || email.length > 30) {
        return false;
    }
    return true;
};

let validEmailChecker = (email) => {
    if (!email) return false;
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    return regExp.test(email);
};

const emailValidators = [
    {
        validator : emailLengthChecker,
        message : "E-mail must be at least 5 characters but no more than 30."
    },
    {
        validator : validEmailChecker,
        message : "Must be a valid E-mail."
    }
];

let usernameLengthChecker = (username) => {
    if (!username) return false;
    if (username.length < 3 || username.length > 15) {
        return false;
    }
    return true;
};

let validUsernameChecker = (username) => {
    if (!username) return false;
    const re = new RegExp(/^[a-zA-Z0-9]+$/);
    return re.test(username);
};

const usernameValidators = [
    {
        validator : usernameLengthChecker,
        message : "Username must be at least 4 characters but no more than 15."
    },
    {
        validator : validUsernameChecker,
        messsage : "Please type valid username."
    }
];

let passwordLengthChecker = (password) => {
    if (!password) return false;
    //console.log(password.length);

    if (password.length < 8 || password.length > 35) {
        return false;
    }
    return true;
};

let validPasswordChecker = (password) => {
    if (!password) return false;
    const re = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/);
    return re.test(password);
};

const passwordValidators = [
    {
        validator : passwordLengthChecker,
        message : "Password : You should type more than 8 but less than 35."
        // 이 validator가 db에 넣을 때 동작하는데, 넣기 전에 비밀번호를 암호화해서 넣으므로
        // 이것을 통과할 수가 없다. 따라서 userSchema.pre를 이용해야 할 경우가 지금이다.
    },
    {
        validator : validPasswordChecker,
        message : "Must have at least one uppercase, lowercase, special character and number."
    }
];

const userSchema = Schema({
    email : {type : String, required : true, unique : true, lowercase : true, validate : emailValidators},
    username : {type : String, required : true, unique : true, lowercase : true, validate : usernameValidators},
    password : {type : String, required : true, validate : passwordValidators}

    // title : String,
    // author : String,
    // body : String,
    // comments : [{body : String, date : Date}],
    // date : {type : Date, default : Date.now},
    // hidden : Boolean,
    // meta : {
    //     votes : number,
    //     favs : number
    // }
});

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

// why are you doing this?
userSchema.pre('save', function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(10, (err, salt) => {
        if (err) next(err);
        else
        {
            bcrypt.hash(this.password, salt, (err, hash) => {
                if (err) throw err;
                this.password = hash;
                next();
            });
        }
    });
});

const User = module.exports = mongoose.model('User', userSchema);

module.exports.addUser = (newUser, callback) => {
    newUser.save(callback);

    // bcrypt.genSalt(10, (err, salt) => {
    //     if (err) throw err;
    //     bcrypt.hash(newUser.password, salt, (err, hash) => {
    //         if (err) throw err;
    //         newUser.password = hash;
    //         newUser.save(callback);
    //     });
    // });
};