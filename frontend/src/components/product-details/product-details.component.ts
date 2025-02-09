import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import { CartService } from '../../services/cart/cart.service';
import { RatingService } from '../../services/rating/rating.service';
import { CommentService } from '../../services/comment/comment.service';
import { Product } from '../../models/Product';
import { AuthService } from '../../services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateCommentRequest } from '../../models/request/CreateCommentRequest';
import { CreateRatingRequest } from '../../models/request/CreateRatingRequest';
import { environment } from '../../environments/environment';
import { UPLOADS_RESOURCE_URL } from '../../helpers/constants';
import {Router} from '@angular/router';
import { User } from '../../models/User';
import { UserService } from '../../services/user/user.service';


@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
  standalone: false
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  productId!: number;
  isLoggedIn: boolean = false;
  newComment: string = '';
  newRating: number = 0;
  serverUrl: string = environment.serverUrl;
  uploadsUrl: string = UPLOADS_RESOURCE_URL;
  loggedUser: User | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private ratingService: RatingService,
    private commentService: CommentService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProduct();
    this.isLoggedIn = this.authService.isUser();
    if (this.isLoggedIn) {
      this.userService.getUser().subscribe({
        next: (user) => {
          this.loggedUser = user;
        },
        error: () => {
          this.snackBar.open('Failed to load user', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
        }
      });
    }
  }

  loadProduct() {
    this.productService.getProductById(this.productId, true, true).subscribe({
      next: (product) => {
        this.product = product;
        console.log(this.product);
      },
      error: () => {
        this.snackBar.open('Failed to load product', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      }
    });
  }

  addToCart() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.product) {
      this.cartService.addToCart(this.product.ID).subscribe({
        next: () => {
          this.snackBar.open('Product added to cart!', 'Close', { duration: 2000 });
        },
        error: (error) => {
          const errorMessage = error?.error?.error || 'Failed to add product to cart';
          this.snackBar.open(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
        }
      });
    }
  }

  postComment() {
    if (!this.newComment.trim()) return;

    const request: CreateCommentRequest = {
      ProductID: this.productId,
      Content: this.newComment
    };

    this.commentService.createComment(request).subscribe({
      next: (comment) => {
        this.product?.Comments.push(comment);
        this.newComment = '';
        this.snackBar.open('Comment posted!', 'Close', { duration: 2000 });
      },
      error: (error) => {
        const errorMessage = error?.error?.error || 'Failed to post comment';
        this.snackBar.open(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      }
    });
  }

  postRating() {
    if (this.newRating < 1 || this.newRating > 5) return;

    const request: CreateRatingRequest = {
      ProductId: this.productId,
      Rating: this.newRating
    };

    this.ratingService.createRating(request).subscribe({
      next: (rating) => {
        this.product?.Ratings.push(rating);
        this.newRating = 0;
        this.snackBar.open('Rating submitted!', 'Close', { duration: 2000 });
      },
      error: (error) => {
        const errorMessage = error?.error?.error || 'Failed to submit rating';
        this.snackBar.open(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
      }
    });
  }
}
