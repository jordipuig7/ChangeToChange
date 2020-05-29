import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service'
import { UserI } from '../../../shared/models/user.interface'
import {FormGroup, FormControl, Validators} from '@angular/forms'
import {Router} from '@angular/router'
import * as firebase from 'firebase';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authSrc: AuthService, private route: Router) { }

  successMessage = "";
  errorMessage = "";
  
  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)

  })

  ngOnInit() {

  }


  
    onLogin(form: UserI){
      this.authSrc.saveLoginCookie(form.email);
      this.authSrc
      .loginByEmail(form)
      .then(res =>{
        console.log('Successfully', res)
        this.route.navigate(['/']);

      })
      .catch(err => console.log('Error', err));
    }

    onClickGoogleLogin(){
      this.authSrc.loginGoogle()
      .then((res) => {
        this.authSrc.saveLoginCookie(res.user.email);
        this.route.navigate(['/']);
      }).catch(err => console.log(err.message));
    }

    public tryRegister(value){
      this.doRegister(value)
      .then(res => {
        console.log(res);
        this.errorMessage = "";
        this.successMessage = "Your account has been created";
      }, err => {
        console.log(err);
        this.errorMessage = err.message;
        this.successMessage = "";
      })
    }
  
    public doRegister(value){
      return new Promise<any>((resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
        .then(res => {
          resolve(res);
        }, err => reject(err))
      })
    }
}
