import { Injectable } from '@angular/core';

import { Http, Headers, RequestOptions } from '@angular/http';
import {tokenNotExpired} from 'angular2-jwt';

import 'rxjs/add/operator/map';


@Injectable()
export class AuthService {

  domain = "http://localhost:8080"; // api is running on 8080
  authToken;
  user;
  options;

  constructor(private http : Http) { }

  createAuthenticationHeaders() {
    // use header to attach header.
    // check if user is authorized.

    this.authToken = this.loadToken();
    // if (!this.authToken) {
    //   console.log("Token not found in browser.");
    // } else {
    //   console.log('this.authToken : ', this.authToken);
    // }

    return new RequestOptions( {
      headers : new Headers({
        'Content-Type' : 'application/json',
        'authorization' : this.authToken
      })
    })
  }

  loadToken() {
    return localStorage.getItem('token');
  }

  registerUser(user) {
    return this.http.post(this.domain + '/authentication/register', user).map(res => res.json());
  }

  checkUsername(username) {
    console.log('in checkUsername, data : ', username);
    return this.http.get(this.domain + '/authentication/checkusername/' + username).map(res => res.json());
  }

  checkEmail(email) {
    return this.http.get(this.domain + '/authentication/checkemail/' + email).map(res => res.json());
  }

  login(user) {
    return this.http.post(this.domain + '/authentication/login', user).map(res => res.json());
  }

  storeUserData(token, user){
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  getProfile() {
    this.options = this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/authentication/profile', this.options).map(res => res.json());
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  loggedIn() {
    return tokenNotExpired();
  }
}
