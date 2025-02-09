import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { 
  CHANGE_PASSWORD_API_URL, 
  EDIT_PROFILE_API_URL,
  GET_USER_BY_ID_API_URL,
  GET_USER_BY_EMAIL_API_URL } from '../../helpers/constants';
import { ChangePasswordRequest } from '../../models/request/ChangePasswordRequest';
import { AuthService } from '../auth/auth.service';
import { EditProfileRequest } from '../../models/request/EditProfileRequest';
import { Observable } from 'rxjs';
import { User } from '../../models/User'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  changePassword(changePasswordRequest: ChangePasswordRequest) {
    const url = this.API_URL + CHANGE_PASSWORD_API_URL;
    const authHeaders = this.authService.getAuthHeader();

    return this.http.post<ChangePasswordRequest>(url, changePasswordRequest, { headers: authHeaders });
  }

  updateProfile(editProfileRequest: EditProfileRequest) {
    const url = this.API_URL + EDIT_PROFILE_API_URL;
    const authHeaders = this.authService.getAuthHeader();

    return this.http.post<EditProfileRequest>(url, editProfileRequest, { headers: authHeaders });
  }

  getUserById(id: number): Observable<User> {
    const url = this.API_URL + GET_USER_BY_ID_API_URL + "/" + id;
    const authHeaders = this.authService.getAuthHeader();

    return this.http.get<User>(url, { headers: authHeaders })
  }

  getUser(): Observable<User> {
    const url = this.API_URL + GET_USER_BY_EMAIL_API_URL + "/" + localStorage.getItem('email');
    const authHeaders = this.authService.getAuthHeader();

    return this.http.get<User>(url, { headers: authHeaders });
  }
 
}
