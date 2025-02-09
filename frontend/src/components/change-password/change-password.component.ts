import {Component, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ChangePasswordRequest} from '../../models/request/ChangePasswordRequest';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {log} from '@angular-devkit/build-angular/src/builders/ssr-dev-server';
import { UserService } from '../../services/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-change-password',
  standalone: false,
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnDestroy {
  changePasswordForm: FormGroup;

  sub$ = new Subscription();

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private router: Router,
              private snackBar: MatSnackBar) {
    this.changePasswordForm = this.fb.group({
      old_password: ['', Validators.required],
      new_password: ['', Validators.required],
    })
  }

  ngOnDestroy() {
    this.sub$.unsubscribe();
  }

  isSubmitDisabled() {
    return this.changePasswordForm.invalid;
  }

  checkFormForErrors(formControlName: string) {
    return this.changePasswordForm.get(formControlName)?.hasError('required')
  }

  getChangePasswordRequest() {
    const changePasswordRequest: ChangePasswordRequest = {
      role: localStorage.getItem("role") ?? "",
      email: localStorage.getItem("email") ?? "",
      password: this.changePasswordForm.get('old_password')?.value,
      new_password: this.changePasswordForm.get('new_password')?.value
    }

    return changePasswordRequest;
  }

  onChangePassword() {
    const changePasswordRequest = this.getChangePasswordRequest()
    console.log(changePasswordRequest);
    this.sub$.add(
      this.userService.changePassword(changePasswordRequest).subscribe({
        next: (response) => {
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
