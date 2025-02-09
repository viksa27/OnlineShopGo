import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';
import { COMMENTS_API_URL } from '../../helpers/constants'
import { CreateCommentRequest } from '../../models/request/CreateCommentRequest';
import { Observable } from 'rxjs';
import { Comment } from '../../models/Comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient, private authService: AuthService) {}

  createComment(createCommentRequest: CreateCommentRequest): Observable<Comment> {
    const url = this.apiUrl + COMMENTS_API_URL;
    const authHeaders = this.authService.getAuthHeader();

    return this.http.post<Comment>(url, createCommentRequest, { headers: authHeaders });
  }

  deleteComment(id: number) {
    const url = this.apiUrl + COMMENTS_API_URL + '/' + id;
    const authHeaders = this.authService.getAuthHeader();

    return this.http.delete<void>(url, { headers: authHeaders });
  }
}
