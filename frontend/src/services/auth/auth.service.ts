import {Injectable} from '@angular/core';
import {HttpHeaders} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
// Service for managing with local storage
export class AuthService {
  constructor() {
  }

  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  }

  loginUser(accessToken: string, email: string, role: string) {
    this.logoutUser();

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem('email', email);
    localStorage.setItem("role", role)
  }

  logoutUser() {
    localStorage.removeItem('email');
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
  }

  isAdmin() {
    return this.isAuthenticated() && localStorage.getItem("role") == "administrator"; 
  }

  isUser() {
    return this.isAuthenticated() && localStorage.getItem("role") == "user";
  }

  getAuthHeader() {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
