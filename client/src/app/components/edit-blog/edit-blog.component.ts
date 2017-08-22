import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BlogService} from '../../services/blog.service';

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css']
})
export class EditBlogComponent implements OnInit {

  message;
  messageClass;
  blog;
  // blog = {
  //   title : String,
  //   body : String
  // }; // blog object
  processing = false;
  currentUrl;
  loading = true;

  constructor(private location : Location,
              private authService : AuthService,
              private activatedRoute : ActivatedRoute,
              private blogService : BlogService,
              private router : Router) {
    //console.log('edit blog constructor');
  }

  ngOnInit() {
    // get the id.
    //console.log('edit blog ngOnInit');
    this.currentUrl = this.activatedRoute.snapshot.params;
    console.log("this.currentUrl : ", this.currentUrl);
    this.blogService.getSingleBlog(this.currentUrl.id).subscribe(data => {
      //console.log(data.message);
      //console.log(data);
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = "Blog not found";

      } else {
        this.blog = data.blog; //data.blog[0]; 그냥 find로 하면 array로 나오고, findOne으로 하면 하나만 온다
        this.loading = false;
      }
    });
  }

  goBack() {
    this.location.back();
  }

  updateBlogSubmit() {
    this.processing = true;
    this.blogService.updateBlog(this.blog).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        setTimeout(() => {
          this.router.navigate(['/blogs']);
        }, 2000)
      }
    })
  }

}
