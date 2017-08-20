import { Injectable } from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {AuthService} from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  redirectUrl;

  constructor(private authService : AuthService,
              private router : Router) {
  }

  canActivate( // this for continuous accessing to the intended router.
    router : ActivatedRouteSnapshot,
    state : RouterStateSnapshot
  ) {
    if (this.authService.loggedIn()){
      return true;
    } else {
      this.redirectUrl = state.url;
      this.router.navigate(['/login']);
      return false;
    }
  }
}
