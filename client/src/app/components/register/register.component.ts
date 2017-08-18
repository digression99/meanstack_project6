import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form : FormGroup;

  createForm() {
    this.form = this.formBuilder.group({
      email : ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        this.validateEmail
      ])],
      username : ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        this.validateUsername
      ])],
      password : ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(35),
        this.validatePassword
      ])],
      confirm : ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(35)
      ])]
    }, {validator: this.matchingPasswords('password', 'confirm')});
  }

  private matchingPasswords(password, confirm) {
    return (group : FormGroup) => {
      if (group.controls[password].value === group.controls[confirm].value) {
        return null;
      } else {
        return {'matchingPasswords' : true};
      }
    }
  }

  private validateEmail(controls) {
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    if (regExp.test(controls.value)) {
      return null;
    } else {
      return {'validateEmail' : true};
    }
  }

  private validateUsername(controls) {
    const re = new RegExp(/^[a-zA-Z0-9]+$/);

    if (re.test(controls.value)) {
      return null;
    } else {
      return {'validateUsername' : true};
    }
  }

  private validatePassword(controls) {
    const re = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/);
    if (re.test(controls.value)) {
      return null;
    } else {
      return {'validatePassword' : true};
    }
  }

  onRegisterSubmit() {
    console.log(this.form);
  }

  constructor(private formBuilder : FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
  }

}
