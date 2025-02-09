import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {LOGIN_API_URL, REGISTER_API_URL} from '../../helpers/constants'
import {LoginRequest} from '../../models/request/LoginRequest';
import {LoginResponse} from '../../models/response/LoginResponse';
import {ChangePasswordRequest} from '../../models/request/ChangePasswordRequest'


@Injectable({
  providedIn: 'root'
})
// Service for communicating with backend for authentication
export class LoginService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(loginRequest: LoginRequest) {
    const url = this.API_URL + LOGIN_API_URL;
    return this.http.post<LoginResponse>(url, loginRequest);
  }

  register(loginRequest: LoginRequest) {
    const url = this.API_URL + REGISTER_API_URL;
    return this.http.post<LoginResponse>(url, loginRequest);
  }
}
