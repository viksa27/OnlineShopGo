import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';
import { PRODUCTS_API_URL } from '../../helpers/constants';
import { Product } from '../../models/Product'
import { AuthService } from '../auth/auth.service';
import { CreateProductRequest } from '../../models/request/CreateProductRequest';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}


  createProduct(req: CreateProductRequest): Observable<Product> {
    const url = this.API_URL + "admin/" + PRODUCTS_API_URL;
    const authHeaders = this.authService.getAuthHeader();

    return this.http.post<Product>(url, req, { headers: authHeaders });
  }

  addImageToProduct(id: number, image: File): Observable<Product> {
    const url = this.API_URL + "admin/" + PRODUCTS_API_URL + "/image/id/" + id;
    const authHeaders = this.authService.getAuthHeader();

    const formData = new FormData();
    formData.append('image', image, image.name);
    

    return this.http.post<Product>(url, formData, { headers: authHeaders });
  }

  removeImageFromProduct(id: number): Observable<any> {
    const url = this.API_URL + "admin/" + PRODUCTS_API_URL + "/image/id/" + id;
    const authHeaders = this.authService.getAuthHeader();

    return this.http.delete<Product>(url, { headers: authHeaders });
  }

  updateProduct(id: number, req: CreateProductRequest): Observable<Product> {
    const url = this.API_URL + "admin/" + PRODUCTS_API_URL + "/id/" + id;
    const authHeaders = this.authService.getAuthHeader();

    return this.http.put<Product>(url, req, { headers: authHeaders });
  }

  deleteProduct(id: number): Observable<any> {
    const url = this.API_URL + "admin/" + PRODUCTS_API_URL + "/id/" + id;
    const authHeaders = this.authService.getAuthHeader();

    return this.http.delete<any>(url, { headers: authHeaders });
  }

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

  getProductById(productId: number, comments: boolean = false, ratings: boolean = false): Observable<Product> {
    const url = `${this.API_URL}products/id/${productId}?comments=${comments}&ratings=${ratings}`;
    const authHeaders = this.authService.getAuthHeader();

    return this.http.get<Product>(url, { headers: authHeaders });
  }
}