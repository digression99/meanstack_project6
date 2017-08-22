/*
20170817 - lesson 4 reactive form에서 색깔이 안바뀐다.


 */

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FlashMessagesModule } from 'angular2-flash-messages';

import { RoutingModule } from './modules/routing/routing.module';
import {ReactiveFormsModule} from '@angular/forms';
import {FormsModule} from '@angular/forms';

import { AuthService } from './services/auth.service';
import {FlashMessagesService} from 'angular2-flash-messages';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import {AuthGuardService} from './services/auth-guard.service';
import {NotAuthGuardService} from './services/not-auth-guard.service';
import { BlogComponent } from './components/blog/blog.component';
import {BlogService} from './services/blog.service';
import { EditBlogComponent } from './components/edit-blog/edit-blog.component';
import { AddBlogComponent } from './components/add-blog/add-blog.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    DashboardComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    BlogComponent,
    EditBlogComponent,
    AddBlogComponent
  ],
  imports: [
    FlashMessagesModule,
    BrowserModule,
    RoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpModule,
  ],
  providers: [AuthService, AuthGuardService,NotAuthGuardService, BlogService, FlashMessagesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
