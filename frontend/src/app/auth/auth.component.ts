import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  signUpForm: FormGroup;
  signInForm: FormGroup;

  signUpError: string;
  signInError: string;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {

  }

  signIn() {
    this.http.post('/api/monster/login', this.signInForm.value).subscribe((result:any) => {
      console.log(result);
      localStorage.setItem('monster', JSON.stringify(result));
      localStorage.setItem('token', JSON.stringify(result.token));
      this.router.navigate(['room']);
    }, (error) => {
      console.log(error);
      this.signInError = error.error.message;
    });
  }

  signUp() {
    if (this.signUpForm.value['password'] !== this.signUpForm.value['repeatedPassword']) {
      this.signUpError = "Passwords don't match";
    } else {
      this.http.post('/api/monster/', this.signUpForm.value).subscribe((result:any) => {
        console.log(result);
        localStorage.setItem('monster', JSON.stringify(result));
        localStorage.setItem('token', JSON.stringify(result.token));
        this.router.navigate(['room']);
      }, (error) => {
        console.log(error);
        this.signUpError = error.error.message;
      });
    }
  }

  ngOnInit() {
    this.signUpForm = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
      repeatedPassword: ['', Validators.required],
      role: ['', Validators.required],
      agree: [false, Validators.requiredTrue]
    });
    this.signInForm = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

}
