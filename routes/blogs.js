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

    router.get('/singleBlog/:id', (req, res) => {
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
                        res.json({success: true, blog: blog})
                    }
                }
            });
        } else {
            res.json({success : false, message : "No blog id was provided."});
        }
    });

    return router;
};