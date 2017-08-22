import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css']
})
export class EditBlogComponent implements OnInit {

  message;
  messageClass;
  blog = {
    title : String,
    body : String
  }; // blog object
  processing = false;

  constructor(private location : Location) { }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }

  updateBlogSubmit() {


  }

}
