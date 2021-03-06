import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from '../../components/home/home.component';
import {DashboardComponent } from '../../components/dashboard/dashboard.component';
import {RegisterComponent} from '../../components/register/register.component';
import {LoginComponent} from '../../components/login/login.component';
import {ProfileComponent} from '../../components/profile/profile.component';
import {AuthGuardService} from '../../services/auth-guard.service';
import {NotAuthGuardService} from '../../services/not-auth-guard.service';
import {BlogComponent} from '../../components/blog/blog.component';
import {EditBlogComponent} from '../../components/edit-blog/edit-blog.component';
import {AddBlogComponent} from '../../components/add-blog/add-blog.component';
import { DeleteBlogComponent } from '../../components/delete-blog/delete-blog.component';
import {PublicProfileComponent} from "../../components/public-profile/public-profile.component";

const appRoutes : Routes = [
  {path : 'users/:username', component : PublicProfileComponent, canActivate : [AuthGuardService]},
  {path : 'login', component : LoginComponent, canActivate:[NotAuthGuardService]},
  {path : 'profile', component : ProfileComponent,  canActivate : [AuthGuardService]},
  {path : 'dashboard', component : DashboardComponent, canActivate : [AuthGuardService]},
  {path : 'register', component : RegisterComponent, canActivate : [NotAuthGuardService]},
  {path : 'blogs/add-blog', component : AddBlogComponent, canActivate : [AuthGuardService]},
  {path : 'blogs/edit-blog/:id', component : EditBlogComponent, canActivate : [AuthGuardService]},
  {path : 'blogs/delete-blog/:id', component : DeleteBlogComponent, canActivate : [AuthGuardService]},
  {path : 'blogs', component : BlogComponent, canActivate : [AuthGuardService]},
  {path : '', component : HomeComponent},
  {path : '**', component : HomeComponent},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes)
  ],
  declarations: [],
  exports : [RouterModule]
})

export class RoutingModule { }
