import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Address } from '../../models/Address';
import { environment } from '../../environments/environment';
import { ADDRESSES_API_URL } from '../../helpers/constants'
import { AuthService } from '../auth/auth.service';
import { AddressRequest } from '../../models/request/AddressRequest';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getUserAddresses(): Observable<{ addresses: Address[] }> {
    const url = this.apiUrl + ADDRESSES_API_URL;
    const authHeaders = this.authService.getAuthHeader();

    return this.http.get<{ addresses: Address[] }>(url, { headers: authHeaders });
  }

  createAddress(address: AddressRequest): Observable<Address> {
    const url = this.apiUrl + ADDRESSES_API_URL;
    const authHeaders = this.authService.getAuthHeader();

    return this.http.post<Address>(url, address, { headers: authHeaders });
  }

  updateAddress(addressId: number, address: AddressRequest): Observable<Address> {
    const url = this.apiUrl + ADDRESSES_API_URL + '/' + addressId;
    const authHeaders = this.authService.getAuthHeader();

    return this.http.put<Address>(url, address, { headers: authHeaders });
  }

  deleteAddress(addressId: number): Observable<void> {
    const url = this.apiUrl + ADDRESSES_API_URL + '/' + addressId;
    const authHeaders = this.authService.getAuthHeader();
    
    return this.http.delete<void>(url, { headers: authHeaders });
  }
}
