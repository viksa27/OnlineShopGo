import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../../models/Category';
import { environment } from '../../environments/environment';
import { CATEGORIES_API_URL } from '../../helpers/constants'
import { CategoryRequest } from '../../models/request/CategoryRequest';
import { AuthService } from '../auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllCategories(): Observable<Category[]> {
    const url = this.API_URL + CATEGORIES_API_URL;
    return this.http.get<Category[]>(url);
  }

  createProduct(req: CategoryRequest): Observable<Category> {
    const url = this.API_URL + "admin/" + CATEGORIES_API_URL;
    const authHeaders = this.authService.getAuthHeader();

    return this.http.post<Category>(url, req, { headers: authHeaders });
  }

  updateCategory(id: number, req: CategoryRequest): Observable<Category> {
    const url = this.API_URL + "admin/" + CATEGORIES_API_URL + "/id/" + id;
    const authHeaders = this.authService.getAuthHeader();

    return this.http.put<Category>(url, req, { headers: authHeaders });
  }

  deleteProduct(id: number): Observable<any> {
    const url = this.API_URL + "admin/" + CATEGORIES_API_URL + "/id/" + id;
    const authHeaders = this.authService.getAuthHeader();

    return this.http.delete<any>(url, { headers: authHeaders });
  }
}
