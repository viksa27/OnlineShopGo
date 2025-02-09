import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';
import { RATINGS_API_URL } from '../../helpers/constants'
import { Observable } from 'rxjs';
import { CreateRatingRequest } from '../../models/request/CreateRatingRequest';
import { Rating } from '../../models/Rating';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  createRating(createRatingRequest: CreateRatingRequest): Observable<Rating> {
    const url = this.apiUrl + RATINGS_API_URL;
    const authHeaders = this.authService.getAuthHeader();

    return this.http.post<Rating>(url, createRatingRequest, { headers: authHeaders });
  }

  deleteRating(id: number) {
    const url = this.apiUrl + RATINGS_API_URL + '/' + id;
    const authHeaders = this.authService.getAuthHeader();

    return this.http.delete<void>(url, { headers: authHeaders });
  }
}
