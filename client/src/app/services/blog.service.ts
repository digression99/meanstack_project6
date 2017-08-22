import { Injectable } from '@angular/core';
import {AuthService} from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';


@Injectable()
export class BlogService {

  options;

  constructor(private authService : AuthService,
              private http : Http) {
  }

  addNewBlog(blog) {
    this.options = this.authService.createAuthenticationHeaders();

    return this.http.post(this.authService.domain + '/blogs/newblog', blog, this.options).map(res => res.json());
  }

  getAllBlogs() {
    this.options = this.authService.createAuthenticationHeaders();

    return this.http.get(this.authService.domain + '/blogs/allblogs', this.options).map(res => res.json());
  }

  getSingleBlog(id) {
    this.options = this.authService.createAuthenticationHeaders();

    return this.http.get(this.authService.domain + '/blogs/single-blog/' + id, this.options).map(res => res.json());
  }

  updateBlog(blog) {
    this.options = this.authService.createAuthenticationHeaders();

    console.log('in update blog, this.options : ', this.options);
    console.log('in update blog, id : ', blog);

    return this.http.put(this.authService.domain + '/blogs/update-blog/', blog, this.options).map(res => res.json());
  }
}
