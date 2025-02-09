import {Component} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: false,

  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

  isUser: boolean = false;
  isAdmin: boolean = false; 
  isLoggedIn: boolean = false;

  constructor(protected authService: AuthService,
              private router: Router) {
  }

  ngOnInit() {
    this.isUser = this.authService.isUser();
    this.isAdmin = this.authService.isAdmin();
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  onAuthenticate() {
    if(this.authService.isAuthenticated()) {
      this.authService.logoutUser();
      this.router.navigate(['/products']).then(() => {
        window.location.reload();
      });
      return;
    }

    this.router.navigate(['/login']);
  }
}
