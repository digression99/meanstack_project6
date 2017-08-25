import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {BlogService} from '../../services/blog.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  messageClass;
  message;
  newPost = false;
  loadingBlogs = false;
  form;
  processing = false;
  username;
  blogPosts;
  newComment = [];
  commentForm;
  enabledComments = []; // The list of the post that user enabled commments.

  constructor(private formBuilder : FormBuilder,
              private authService : AuthService,
              private blogService : BlogService,
              private router : Router) {
    //this.createNewBlogForm();
  }

  ngOnInit() {
    //console.log('blog ngOnInit.');
    this.authService.getProfile().subscribe(data => {
      if (data.user) {
        this.username = data.user.username;
        this.createNewBlogForm();
        this.createCommentForm();
        this.getAllBlogs();
      } else {
        this.router.navigate(['/login']).then();
      }
    });
  }

  createNewBlogForm() {
    this.form = this.formBuilder.group({
      title : ['', Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(5),
        this.alphaNumericValidation
      ])],
      body : ['', Validators.compose([
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(5),
      ])]
    })
  }

  alphaNumericValidation(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);

    if (regExp.test(controls.value)) return null;
    else {
      return {'alphaNumericValidation' : true};
    }
  }

  enableNewBlogForm() {
    this.form.get('title').enable();
    this.form.get('body').enable();
  }

  disableNewBlogForm() {
    this.form.get('title').disable();
    this.form.get('body').disable();
  }

  createCommentForm() {
    this.commentForm = this.formBuilder.group({
      comment : ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(200)
      ])]
    })

  }

  reloadBlogs() {
    this.loadingBlogs = true;
    // get all blogs.
    this.getAllBlogs();
    setTimeout(() => {
      this.loadingBlogs = false;
    }, 4000)
  }

  draftComment(id) {
    this.commentForm.reset();
    this.newComment = [];
    this.newComment.push(id);
  }

  enableCommentForm() {
    this.commentForm.get('comment').enable();
  }
  disableCommentForm() {
    this.commentForm.get('comment').disable();
  }

  cancelCommentSubmission(id) {
    const index = this.newComment.indexOf(id);
    this.newComment.splice(index, 1);
    this.commentForm.reset();
    this.enableCommentForm();
    this.processing = false;
  }

  getAllBlogs() {
    this.blogService.getAllBlogs().subscribe(data => {
      this.blogPosts = data.blogs;
    });
  }

  likeBlog(id) {
    console.log("I am in like blog.");
    this.blogService.likeBlog(id).subscribe(data => {
      if (!data.success) {
        this.messageClass = "alert alert-danger";
        this.message = data.message;
      } else {
        console.log("I liked the blog.");
        this.getAllBlogs();
      }
    })
  }

  dislikeBlog(id) {
    this.blogService.dislikeBlog(id).subscribe(data => {
      this.getAllBlogs();
    })
  }

  postComment(id) {
    this.disableCommentForm();
    this.processing = true;
    const comment = this.commentForm.get('comment').value;

    this.blogService.postComment(id, comment).subscribe(data => {
      this.getAllBlogs();
      const index = this.newComment.indexOf(id);
      this.newComment.splice(index, 1);
      this.enableCommentForm();
      this.commentForm.reset();
      this.processing = false;

      if (this.enabledComments.indexOf(id) < 0) {
        this.expand(id);
      }
    });
  }

  expand(id) {
    // expand the comments
    this.enabledComments.push(id);
  }

  collapse(id) {
    const index = this.enabledComments.indexOf(id);
    this.enabledComments.splice(index, 1);

  }
}
