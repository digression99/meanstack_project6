import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from '../../components/home/home.component';
import {DashboardComponent } from '../../components/dashboard/dashboard.component';
import {RegisterComponent} from '../../components/register/register.component';

const appRoutes : Routes = [
  {path : 'dashboard', component : DashboardComponent},
  {path : 'register', component : RegisterComponent},
  {path : '', component : HomeComponent},
  {path : '**', component : HomeComponent}
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
