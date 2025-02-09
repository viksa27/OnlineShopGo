import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from '../components/login/login.component';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {MatFormField, MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {ProductsComponent} from '../components/products/products.component';
import {NavBarComponent} from '../components/nav-bar/nav-bar.component';
import {ReactiveFormsModule} from '@angular/forms';
import {provideHttpClient} from '@angular/common/http';
import {MatToolbarModule} from '@angular/material/toolbar';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardFooter,
  MatCardHeader, MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {PaymentFormComponent} from '../components/payment-form/payment-form.component';
import {SuccessComponent} from '../components/success/success.component';
import {ChangePasswordComponent} from '../components/change-password/change-password.component';
import {MatIcon} from '@angular/material/icon';
import {MyProfileComponent} from '../components/my-profile/my-profile.component';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select'
import { FormsModule } from '@angular/forms';
import { CartComponent } from '../components/cart/cart.component';
import { OrderComponent } from '../components/order/order.component';
import { MyOrdersComponent } from '../components/my-orders/my-orders.component';
import { ProductDetailsComponent } from '../components/product-details/product-details.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProductsComponent,
    NavBarComponent,
    PaymentFormComponent,
    SuccessComponent,
    MyProfileComponent,
    ChangePasswordComponent,
    CartComponent,
    OrderComponent,
    MyOrdersComponent,
    ProductDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatFormField,
    MatLabel,
    MatInputModule,
    MatInput,
    MatButton,
    ReactiveFormsModule,
    MatToolbarModule,
    MatCard,
    MatCardHeader,
    MatCardFooter,
    MatCardContent,
    MatCardActions,
    MatCardTitle,
    MatCardSubtitle,
    MatIcon,
    MatProgressSpinner,
    MatSelectModule,
    FormsModule,
  ],
  providers: [
    provideAnimationsAsync('noop'),
    provideAnimationsAsync(),
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
