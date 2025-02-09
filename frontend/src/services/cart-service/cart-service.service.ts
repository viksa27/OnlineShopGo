import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartEntry } from '../../models/CartEntry';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { CART_API_URL } from '../../helpers/constants'

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getCartEntries(): Observable<CartEntry[]> {
    const url = this.apiUrl + CART_API_URL;
    const authHeaders = this.authService.getAuthHeader();

    return this.http.get<CartEntry[]>(url, { headers: authHeaders });
  }

  addToCart(productId: number): Observable<any> {
    const url = this.apiUrl + CART_API_URL + `/${productId}`;
    const authHeaders = this.authService.getAuthHeader();
  
    return this.http.post(url, {}, { headers: authHeaders });
  }

  updateCartQuantity(productId: number, quantity: number): Observable<any> {
    const url = this.apiUrl + CART_API_URL;
    const authHeaders = this.authService.getAuthHeader();

    return this.http.put(url, { ProductID: productId, Quantity: quantity }, { headers: authHeaders });
  }

  removeFromCart(productId: number): Observable<any> {
    const url = this.apiUrl + CART_API_URL;
    const authHeaders = this.authService.getAuthHeader();

    return this.http.delete(`${url}/${productId}`, { headers: authHeaders });
  }

  clearCart(): Observable<any> {
    const url = this.apiUrl + CART_API_URL;
    const authHeaders = this.authService.getAuthHeader();

    return this.http.delete(`${url}/clear`, { headers: authHeaders });
  }
}
