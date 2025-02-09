import {Component, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoginRequest} from '../../models/request/LoginRequest';
import {LoginService} from '../../services/login/login.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-admin',
  standalone: false,
  
  templateUrl: './add-admin.component.html',
  styleUrl: './add-admin.component.css'
})
export class AddAdminComponent {
  registerForm: FormGroup;
  email = "";

  sub$ = new Subscription();

  constructor(private fb: FormBuilder,
              private loginService: LoginService,
              private router: Router,
              private snackBar: MatSnackBar) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    })
  }

  ngOnDestroy() {
    this.sub$.unsubscribe();
  }

  isSubmitDisabled() {
    return this.registerForm.invalid;
  }

  checkFormRequired(formControlName: string) {
    return this.registerForm.get(formControlName)?.hasError('required');
  }

  checkFormEmailValidity(formControlName: string) {
    return this.registerForm.get(formControlName)?.hasError('email');
  }

  checkFormForErrors(formControlName: string) {
    return this.checkFormRequired(formControlName) || this.checkFormEmailValidity(formControlName);
  }

  getLoginRequest() {
    const loginRequest: LoginRequest = {
      Email: this.registerForm.get('email')?.value,
      Password: this.registerForm.get('password')?.value
    }

    return loginRequest;
  }


  onRegister() {
    const loginRequest = this.getLoginRequest()

    this.sub$.add(
      this.loginService.registerAdmin(loginRequest).subscribe({
        next: (response) => {
          this.snackBar.open('Successfully registered admin!', 'Close', { duration: 2000 });
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

}
