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
}
