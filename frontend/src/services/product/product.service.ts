import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';
import { PRODUCTS_API_URL } from '../../helpers/constants';
import { Product } from '../../models/Product'
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Method to get the list of products
  getProducts(): Observable<Product[]> {
    const url = this.API_URL + PRODUCTS_API_URL;
    return this.http.get<Product[]>(url);
  }

  getProductsInCart(): Observable<Product[]> {
    const url = this.API_URL + PRODUCTS_API_URL + '/cart';
    const authHeaders = this.authService.getAuthHeader();
  
    return this.http.get<Product[]>(url, { headers: authHeaders });
  }

  getProductById(productId: number): Observable<Product> {
    const url = `${this.API_URL}products/id/${productId}`;
    const authHeaders = this.authService.getAuthHeader();

    return this.http.get<Product>(url, { headers: authHeaders });
  }
}