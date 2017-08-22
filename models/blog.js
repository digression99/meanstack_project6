const mongoose = require('mongoose');

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

let titleLengthChecker = (title) => {
    if (!title) return false;
    if (title.length < 5 || title.length > 50) {
        return false;
    }
    return true;
};

let alphaNumericTitleChecker = (title) => {
    if (!title) return false;
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);

    return regExp.test(title);
};

const titleValidators = [
    {
        validator : titleLengthChecker,
        message : "Title must be at least 5 characters but no more than 50."
    },
    {
        validator : alphaNumericTitleChecker,
        message : "Must be Alpha-Numeric."
    }
];

let bodyLengthChecker = (body) => {
    if (!body) return false;
    if (body.length < 5 || body.length > 500) {
        return false;
    }
    return true;
};

const bodyValidators = [
    {
        validator : bodyLengthChecker,
        message : "Body must be at least 5 characters but no more than 500."
    }
];

let commentLengthChecker = (comment) => {
    if (!comment[0]) return false;
    //console.log(password.length);

    if (comment[0].length < 1 || comment[0].length > 200) {
        return false;
    }
    return true;
};

const commentValidators = [
    {
        validator : commentLengthChecker,
        message : "Comment must be at least 1 characters but no more than 200."
    },
];

const blogSchema = new Schema({
    title : {type : String, required : true, validator : titleValidators},
    body : {type : String, required : true, validator : bodyValidators},
    createdBy : {type : String},
    createdAt : {type : Date, default:Date.now()},
    likes : {type:Number, default:0},
    likedBy: {type:Array},
    dislikes : {type:Number, default:0},
    dislikedBy: {type:Array},
    comments : [
        {
            comment : {type : String, validator : commentValidators},
            commentator : {type : String}
        }
    ]


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

const Blog = module.exports = mongoose.model('Blog', blogSchema);

module.exports.addBlog = (newBlog, callback) => {
    newBlog.save(callback);
};

module.exports.findAllBlog = (callback) => {
    Blog.find({}, callback).sort({_id : -1});
};

module.exports.findOneBlogById = (id, callback) => {
    Blog.find({_id : id}, callback);
};