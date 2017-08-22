import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import { FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {BlogService} from '../../services/blog.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-blog',
  templateUrl: './add-blog.component.html',
  styleUrls: ['./add-blog.component.css']
})
export class AddBlogComponent implements OnInit {

  messageClass;
  message;
  processing;
  username;
  form : FormGroup;


  constructor(private authService : AuthService, // blog Component와 데이터 바인딩 필요
              private blogService : BlogService,
              private formBuilder : FormBuilder,
              private router : Router) { }

  ngOnInit() {
    this.createNewBlogForm();
    //this.getAllBlogs();

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
    this.router.navigate(['/blogs']);

    //window.location.reload();
  }

  enableNewBlogForm() {
    this.form.get('title').enable();
    this.form.get('body').enable();
  }

  disableNewBlogForm() {
    this.form.get('title').disable();
    this.form.get('body').disable();
  }

  onBlogSubmit() {
    this.processing = true; // if processing, block the form.
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
        //this.getAllBlogs();
        this.messageClass = 'alert alert-success';
        this.message = data.message;

        setTimeout(() => {
          //this.newPost = false;
          this.processing = false;
          this.message = false;
          this.form.reset();
          this.enableNewBlogForm();
          this.router.navigate(['/blogs']);
        }, 2000)
      }
    });
  }
}
