import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { PAYMENT_CARD_API_URL } from '../../helpers/constants'
import { PaymentCard } from '../../models/PaymentCard';
import { CreateCardRequest } from '../../models/request/CreateCardRequest';
import { Observable } from 'rxjs';
import { GetCardsResponse } from '../../models/response/GetCardsResponse';


@Injectable({
  providedIn: 'root'
})
export class PaymentCardService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  createCard(req: CreateCardRequest): Observable<PaymentCard> {
    const url = this.API_URL + PAYMENT_CARD_API_URL;
    const authHeaders = this.authService.getAuthHeader();

    return this.http.post<PaymentCard>(url, req, { headers: authHeaders });
  }

  getUserCards(): Observable<GetCardsResponse> {
    const url = this.API_URL + PAYMENT_CARD_API_URL;
    const authHeaders = this.authService.getAuthHeader();

    return this.http.get<GetCardsResponse>(url, { headers: authHeaders });
  }

  deleteCard(id: number) {
    const url = this.API_URL + PAYMENT_CARD_API_URL + '/' + id;
    const authHeaders = this.authService.getAuthHeader();

    return this.http.delete<void>(url, { headers: authHeaders });
  }

}
