import {Component, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoginRequest} from '../../models/request/LoginRequest';
import {LoginService} from '../../services/login/login.service';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnDestroy {
  loginForm: FormGroup;
  isLogin = true;
  email = "";

  sub$ = new Subscription();

  constructor(private fb: FormBuilder,
              private loginService: LoginService,
              private authService: AuthService,
              private router: Router,
              private snackBar: MatSnackBar) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    })
  }

  ngOnDestroy() {
    this.sub$.unsubscribe();
  }

  isSubmitDisabled() {
    return this.loginForm.invalid;
  }

  checkFormRequired(formControlName: string) {
    return this.loginForm.get(formControlName)?.hasError('required');
  }

  checkFormEmailValidity(formControlName: string) {
    return this.loginForm.get(formControlName)?.hasError('email');
  }

  checkFormForErrors(formControlName: string) {
    return this.checkFormRequired(formControlName) || this.checkFormEmailValidity(formControlName);
  }

  getLoginRequest() {
    const loginRequest: LoginRequest = {
      Email: this.loginForm.get('email')?.value,
      Password: this.loginForm.get('password')?.value
    }

    return loginRequest;
  }

  onLogin() {
    const loginRequest = this.getLoginRequest()

    this.sub$.add(
      this.loginService.login(loginRequest).subscribe({
        next: (response) => {
          this.authService.loginUser(response.token, loginRequest.Email, response.role);
          this.snackBar.open('Successfully logged in!', 'Close', { duration: 2000 });
          this.router.navigate(['/products']);
        },
        error: (error) => {
            if (error.status === 400) {
              this.snackBar.open("Incorrect credentials", 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
            }
            else {
              const errorMessage = error?.error?.error || "Something went wrong";
              this.snackBar.open(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
            }
          }
      })
    );
  }

  onRegister() {
    const loginRequest = this.getLoginRequest()

    this.sub$.add(
      this.loginService.register(loginRequest).subscribe({
        next: (response) => {
          this.authService.loginUser(response.token, loginRequest.Email, response.role);
          this.snackBar.open('Successfully registered!', 'Close', { duration: 2000 });
          this.router.navigate(['/products']);
        },
        error: (error) => {
          if (error.status === 400) {
            this.snackBar.open("Incorrect credentials", 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
          }
          else {
            const errorMessage = error?.error?.error || "Something went wrong";
            this.snackBar.open(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
          }
        }
      })
    );
  }

  toggleIsLogin() {
    this.isLogin = !this.isLogin;
  }
}
