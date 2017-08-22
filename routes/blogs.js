const User = require('../models/user');
const Blog = require('../models/blog');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports = (router) => {

    router.post('/newblog', (req, res) => {

        if (!req.body.title) {
            res.json({success : false, message : "Blog title is required."});
        } else if (!req.body.body) {
            res.json({success : false, message : "Blog body is required."});
        } else if (!req.body.createdBy) {
            res.json({success : false, message : "Blog creator is required."});
        } else {
            const blog = new Blog({
                title : req.body.title,
                body : req.body.body,
                createdBy : req.body.createdBy
            });

            Blog.addBlog(blog,(err) => {
                if (err) {
                    if (err.errors) {
                        if (err.errors.title) {
                            res.json({success : false, message : err.errors.title.message});
                        } else if (err.errors.body) {
                            res.json({success : false, message : err.errors.body.message});
                        } else {
                            res.json({success : false, message : err.errmsg});

                        }
                    } else {
                        res.json({success : false, message : err});
                    }
                } else {
                    res.json({success : true, message : 'Blog Saved!'});
                }
            })
        }
    });

    router.get('/allblogs', (req, res) => {
        Blog.findAllBlog((err, blogs) => {
            if (err) {
                res.json({success : false, message : err});
            } else {
                if (!blogs) {
                    res.json({success : false, message : "No Blogs Found."});
                } else {
                    res.json({success : true, blogs : blogs});
                }
            }
        })
    });

    router.get('/single-blog/:id', (req, res) => {
        const id = req.params.id;
        if (id) {
            Blog.findOneBlogById(id, (err, blog) => {
                if (err) {
                    // typically, error generates because id is not valid.
                    res.json({success : false, message : "ID is not valid."});
                } else {
                    if (!blog) {
                        res.json({success : false, message : 'Blog not found!'});
                    } else {
                        // check the user.
                        User.findUserById(req.decoded.userId, (err, user) => {
                            if (err) {
                                res.json({success : false, message : err});
                            } else {
                                if (!user) {
                                    res.json({success : false, message : "Unable to authenticate user."});
                                } else if (user.username !== blog.createdBy) {
                                    res.json({success : false, message : "You are not authorized to edit this blog."});
                                } else {
                                    res.json({success : true, blog : blog});
                                }
                            }
                        });
                    }
                }
            });
        } else {
            res.json({success : false, message : "No blog id was provided."});
        }
    });

    router.put('/update-blog/', (req, res) => {
        // to update blogs.
        // even if I send the whole blog object, it is divided into pieces.
        let id = req.body._id;
        //console.log(req.body);

        if (!id) {
            res.json({success : false, message : "No blog ID provided."});
        } else {
            Blog.findOneBlogById({_id : id}, (err, blog) => {
                if (err) {
                    res.json({success : false, message : "Not a valid blog id."});
                } else {
                    if (!blog) {
                        res.json({success : false, message : "Blog not found."})
                    } else {
                        console.log('blog object : ', blog);
                        // now try to find user with userId and
                        // check if the createdBy matches userId. and then, update it.

                        User.findUserById(req.decoded.userId, (err, user) => {
                            if (err) {
                                res.json({success : false, message : err});
                            } else {
                                if (!user) {
                                    res.json({success : false, message : "Unable to authenticate user."});
                                } else {
                                    if (user.username !== blog.createdBy) {
                                        res.json({success : false, message : "You are not authorized to edit this post."});
                                    } else {
                                        blog.title = req.body.title;
                                        blog.body = req.body.body;

                                        Blog.updateBlog(blog, (err) => {
                                            if (err) {
                                                res.json({success : false, message : err});
                                            } else {
                                                res.json({success : true, message : "Blog updated."});
                                            }
                                        });
                                    }
                                }
                            }
                        })
                    }
                }
            });
        }
    });

    router.delete('/delete-blog/:id', (req, res) => {
        let id = req.params.id;

        if (!id) {
            res.json({success : false, message : "No id provided."});
        } else {
            Blog.findOneBlogById(id, (err, blog) => {
                if (err) {
                    res.json({success : false, message : err});
                } else if (!blog) {
                    res.json({success : false, message : "Blog not found."});
                } else {
                    User.findUserById(req.decoded.userId, (err, user) => {
                        if (err) {
                            res.json({success : false, message : err});
                        } else if (!user) {
                            res.json({success : false, message : "Unable to authenticate user."});
                        } else {
                            if (user.username !== blog.createdBy) {
                                res.json({success : false, message : "You are not authorized to delete this blog."});
                            } else {
                                Blog.deleteBlog(blog, (err) => {
                                    if (err) {
                                        res.json({success : false, message : err});
                                    } else {
                                        res.json({success : true, message : "Blog deleted."});
                                    }
                                })
                            }
                        }
                    })
                }
            })
        }
    });

    return router;
};