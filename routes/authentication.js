const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database');


module.exports = (router) => {

    router.post('/login', (req, res) => {

        if (!req.body.username) {
            res.json({success : false, message : "No username is provided."});
        } else if (!req.body.password) {
            res.json({success : false, message : "No password is provided."});
        } else {
            User.findOne({username : req.body.username.toLowerCase()}, (err, user) => {
                if (err) {
                    res.json({success : false, message : err});
                } else {
                    if (!user) {
                        res.json({success : false, message : "User not found."});
                    } else {
                        const validPassword = user.comparePassword(req.body.password);
                        if (!validPassword) {
                            res.json({success : false, message : "Password invalid."});
                        } else {

                            // jwt used.

                            // jwt can be decrypted so use safe thing.
                            const token = jwt.sign({userId : user._id}, config.secret, {expiresIn:'24h'});


                            res.json({success : true, message : "Login Success.", token : token, user : {username : user.username}});
                        }
                    }
                }
            })
        }
    });

    router.get('/register', (req, res) => {
        res.send('this is register get router.');
    });

    router.post('/register', (req, res) => {
        if (!req.body.email || !req.body.username || !req.body.password) {
            res.json({success : false, message : 'You must fill in the form.'});
        } else {
            let user = new User ({
                email : req.body.email.toLowerCase(),
                username : req.body.username.toLowerCase(),
                password : req.body.password
            });

            User.addUser(user, (err) => {
                if (err && err.code === 11000) {
                    res.json({success : false, message : 'Username or E-mail already exists.'});
                } else {
                    if (err && err.errors) {
                        if (err.errors.email) {
                            res.json({success: false, message: err.errors.email.message});
                        } else if (err.errors.username) {
                            res.json({success : false, message : err.errors.username.message});
                        } else if (err.errors.password) {
                            res.json({success : false, message : err.errors.password.message});
                        }
                        else {
                            res.json({success: false, message: 'Could not save user.'});
                        }
                    } else {
                        res.json({success : true, message : 'Account registered.'});
                    }
                }
            });
        }
    });

    router.get('/checkemail/:email', (req, res) => {
        if (!req.params.email) {
            res.json({success : false, message : 'Email was not provided.'});
        } else {
            User.findOne({email : req.params.email}, (err, user) => {
                if (err) res.json({success : false, message : err});
                else {
                    if (user) {
                        res.json({success : false, message : 'Email is already taken.'});
                    } else {
                        res.json({success : true, message : 'Email is available.'});
                    }
                }
            })
        }
    });

    router.get('/checkusername/:username', (req, res) => {
        if (!req.params.username) {
            res.json({success : false, message : 'Email was not provided.'});
        } else {
            User.findOne({username : req.params.username}, (err, user) => {
                if (err) res.json({success : false, message : err});
                else {
                    if (user) {
                        res.json({success : false, message : 'Username is already taken.'});
                    } else {
                        res.json({success : true, message : 'Username is available.'});
                    }
                }
            })
        }
    });

    // use middleware to get header.
    // router that don't need authrorization goes before this middleware.
    // router that need authroization goes after this middleware.
    router.use((req, res, next) => {
        const token = req.headers['authorization'];
        if (!token)
        {
            res.json({success : false, message : 'No token provided.'});
        } else {
            // verify that token using secret.
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) {
                    res.json({success : false, message : "Token invalid, " + err});
                } else {
                    req.decoded = decoded;
                    next();
                    //res.json({success : true, });
                }
            });

            //res.json({success : true, message : ''});
        }
    });

    router.get('/profile', (req, res) => {
        // use token to check who logged in.
        //res.send(req.decoded);

        User.findOne({_id : req.decoded.userId}).select('username email').exec((err, user) => {
            if (err) {
                res.json({success : false, message : err});
            } else {
                if (!user) {
                    res.json({success : false, message : 'user not found.'});
                } else {
                    res.json({success : true, user : user});
                }
            }
        })
    });

    return router;
};