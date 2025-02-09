import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';
import { ORDER_API_URL } from '../../helpers/constants';
import { Order } from '../../models/Order';
import { OrderRequest } from '../../models/request/OrderRequest';


@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  createOrder(order: OrderRequest): Observable<any> {
    const url = this.apiUrl + ORDER_API_URL;
    const authHeaders = this.authService.getAuthHeader();

    return this.http.post(url, order, { headers: authHeaders });
  }

  getUserOrders(): Observable<Order[]> {
    const url = this.apiUrl + ORDER_API_URL;
    const authHeaders = this.authService.getAuthHeader();

    return this.http.get<Order[]>(url, { headers: authHeaders });
  }
}
