import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../../models/Category';
import { environment } from '../../environments/environment';
import { CATEGORIES_API_URL } from '../../helpers/constants'

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<Category[]> {
    const url = this.API_URL + CATEGORIES_API_URL;
    return this.http.get<Category[]>(url);
  }
}
