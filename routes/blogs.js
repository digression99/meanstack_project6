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

    router.put('/like-blog', (req, res) => {
        // liking a blog is a put request.(update)
        console.log("I am in likeblog put req.");
        if (!req.body.id) {
            res.json({success: false, message : "No ID provided."});
        } else {
            console.log("I am in likeblog put req 1.");
            Blog.findOneBlogById(req.body.id, (err, blog) => {
                if (err) {
                    res.json({success : false, message : err});
                } else if (!blog) {
                        res.json({success : false, message : "Blog is not found."})
                } else {
                    console.log("I am in likeblog put req 2.");
                    User.findUserById(req.decoded.userId, (err, user) => {
                        if (err) res.json({success : false, message : err});
                        else if (!user) res.json({success : false, message : "Could not authenticate user."});
                        else {
                            console.log("I am in likeblog put req 3.");
                            if (user.username === blog.createdBy) {
                                console.log("The problem is you liked your own post.");
                                res.json({success : false, message : "Cannot like your own post."});
                            } else {
                                console.log("already checked the validation.");

                                // check if the user already liked the post.
                                if (blog.likedBy.includes(user.username)) {
                                    // already liked it.
                                    // in front, just make it disable.
                                    // but, you can make it as the meaning of cancelling the liking.
                                    res.json({success : false, message : "You already liked this post."});
                                } else {
                                    // Check if the user disliked the post.
                                    // then, we subtract one dislike from the post and erase the user
                                    // from the dislike array.
                                    // then do the work.

                                    if (blog.dislikedBy.includes(user.username)) {
                                        blog.dislikes--;
                                        let idx = blog.dislikedBy.indexOf(user.username);
                                        blog.dislikedBy.splice(idx, 1); // remove the user from the array.
                                    }
                                    blog.likes++;
                                    blog.likedBy.push(user.username);

                                    Blog.updateBlog(blog, (err) => {
                                        if (err) res.json({success : false, message : err});
                                        else {
                                            res.json({success : true, message : "You liked the post."});
                                        }
                                    });
                                }
                            }
                        }
                    })
                }
            })
        }
    });

    router.put('/dislike-blog', (req, res) => {
        // liking a blog is a put request.(update)
        if (!req.body.id) {
            res.json({success: false, message : "No ID provided."});
        } else {
            Blog.findOneBlogById(req.body.id, (err, blog) => {
                if (err) {
                    res.json({success : false, message : err});
                } else if (!blog) {
                    res.json({success : false, message : "Blog is not found."})
                } else {
                    User.findUserById(req.decoded.userId, (err, user) => {
                        if (err) res.json({success : false, message : err});
                        else if (!user) res.json({success : false, message : "Could not authenticate user."});
                        else {
                            if (user.username === blog.createdBy) {
                                res.json({success : false, message : "Cannot dislike your own post."});
                            } else {
                                if (blog.dislikedBy.includes(user.username)) {
                                    res.json({success : false, message : "You already disliked this post."});
                                } else {
                                    if (blog.likedBy.includes(user.username)) {
                                        blog.likes--;
                                        let idx = blog.likedBy.indexOf(user.username);
                                        blog.likedBy.splice(idx, 1); // remove the user from the array.
                                    }
                                    blog.dislikes++;
                                    blog.dislikedBy.push(user.username);

                                    Blog.updateBlog(blog, (err) => {
                                        if (err) res.json({success : false, message : err});
                                        else {
                                            res.json({success : true, message : "You disliked the post."});
                                        }
                                    });
                                }
                            }
                        }
                    })
                }
            })
        }
    });

    router.put('/comment', (req, res) => {
        if (!req.body.comment) {
            res.json({success : false, message : "No comment provided."});
        } else if (!req.body.id) {
            res.json({success : false, message : "No ID provided."});
        } else {
            Blog.findOneBlogById(req.body.id, (err, blog) => {
                if (err) {
                    res.json({success : false, message : err});
                } else if (!blog) {
                    res.json({success : false, message : "Blog not found."});
                } else {
                    User.findUserById(req.decoded.userId, (err, user) => {
                        if (err) {
                            res.json({success : false, message : "Something went wrong."});
                        } else if (!user) {
                            res.json({success : false, message : "User not found."});
                        } else {
                            blog.comments.push({
                                comment : req.body.comment,
                                commentator : user.username
                            });
                            Blog.updateBlog(blog, (err) => {
                                if (err) {
                                    res.json({success : false, message : "Something went wrong."});
                                } else {
                                    res.json({success : true, message : "Comment saved."});
                                }
                            })
                        }
                    })
                }
            })
        }
    });

    return router;
};