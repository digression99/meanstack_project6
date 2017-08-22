import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {BlogService} from '../../services/blog.service';

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

  constructor(private formBuilder : FormBuilder,
              private authService : AuthService,
              private blogService : BlogService) {
    //this.createNewBlogForm();
  }

  ngOnInit() {
    this.createNewBlogForm();
    this.getAllBlogs();

    this.authService.getProfile().subscribe(data => {
      this.username = data.user.username;
    })


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

  goBack() {
    window.location.reload();
  }

  enableNewBlogForm() {
    this.form.get('title').enable();
    this.form.get('body').enable();
  }

  disableNewBlogForm() {
    this.form.get('title').disable();
    this.form.get('body').disable();
  }

  newBlogForm() {
    this.newPost = true;
  }

  reloadBlogs() {
    this.loadingBlogs = true;
    // get all blogs.
    this.getAllBlogs();
    setTimeout(() => {
      this.loadingBlogs = false;
    }, 4000)
  }

  draftComment() {

  }

  getAllBlogs() {
    this.blogService.getAllBlogs().subscribe(data => {
      this.blogPosts = data.blogs;
    });
  }

  onBlogSubmit() {
    this.processing = true;
    this.disableNewBlogForm();

    const blog = {
      title : this.form.get('title').value,
      body : this.form.get('body').value,
      createdBy : this.username
    };

    this.blogService.addNewBlog(blog).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
        this.enableNewBlogForm();
      } else {
        this.getAllBlogs();
        this.messageClass = 'alert alert-success';
        this.message = data.message;

        setTimeout(() => {
          this.newPost = false;
          this.processing = false;
          this.message = false;
          this.form.reset();
          this.enableNewBlogForm();
        }, 2000)
      }
    });
  }
}
