import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ILoginResponse, ISignUp} from '../auth.config';
import {AuthApi} from '../../services/auth-api';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './auth.html',
  styleUrl: './auth.scss'
})
export class Auth implements OnInit{
  isLogin: boolean = true
  form!: FormGroup

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authApi: AuthApi,
    private snackBar: MatSnackBar
  ) {

  }

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      actor: new FormGroup({
        last_name: new FormControl('', [Validators.required, Validators.minLength(3)]),
        first_name: new FormControl('', [Validators.required, Validators.minLength(3)]),
        middle_name: new FormControl('', [Validators.required, Validators.minLength(3)]),
        rank: new FormControl('', [Validators.minLength(3)]),
        experience: new FormControl('', [Validators.min(0)])
      })
    });

    const usernameControl = this.form.get('username') as FormControl;
    const actorGroup = this.form.get('actor') as FormGroup;

    this.route.paramMap.subscribe(params => {
      const mode = params.get('mode');
      this.isLogin = (mode !== 'signup');

      if (this.isLogin) {
        usernameControl.clearValidators();
        usernameControl.updateValueAndValidity();

        actorGroup.disable();
        actorGroup.updateValueAndValidity();
      } else {
        usernameControl.setValidators([Validators.required, Validators.minLength(3)]);
        usernameControl.updateValueAndValidity();

        actorGroup.enable();
        actorGroup.updateValueAndValidity();
      }
    });
  }

  public get authValidation(){
    return this.form.controls
  }

  public get actorValidation() {
    return (this.form.get('actor') as FormGroup).controls;
  }

  public navigateToAnotherAuth() {

    const newMode = this.isLogin ? 'signup' : 'login';
    this.router.navigate(['/auth', newMode]);
    this.form.reset()
  }



  public onSubmit() {
    console.log('Valid form:', this.form.valid)
    if (this.form.valid) {

      if (this.isLogin) {
        const email =  this.form.value.email;
        const password = this.form.value.password;
        this.authApi.logIn(email, password).subscribe({
          next: (res: ILoginResponse) => {
            if (res.token){
              this.authApi.saveToken(res.token)
            }

            this.router.navigate(['/'])
            this.snackBar.open("Welcome to the home page", 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['custom-snackbar']
            });
          },
          error: (err) => {
            console.error('Error login:', err)
            this.snackBar.open("Incorrect email or password", 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['custom-snackbar-invalid-form']
            });
          }
        })

      } else {
        const user : ISignUp = this.form.value
        // Delete empty field
        Object.keys(user).forEach((key) => {
          if (user[key as keyof ISignUp] === '') {
            delete user[key as keyof ISignUp];
          }
        })

        this.authApi.signUp(user).subscribe({
          next: () => {
            console.log(user)
            this.navigateToAnotherAuth()
            this.isLogin = true
          },
          error: err => {
            console.error('Signup error:', err);
          }
        })

      }
    }
  }
}
