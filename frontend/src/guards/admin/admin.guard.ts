import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): boolean {
    const isAdmin = this.authService.isAdmin();

    if (isAdmin) {
      return true;
    } else {
      this.router.navigate(['/products']);
      return false;
    }
  }
}
