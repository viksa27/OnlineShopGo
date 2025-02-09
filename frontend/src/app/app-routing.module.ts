import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from '../components/login/login.component';
import {ProductsComponent} from '../components/products/products.component';
import {AuthGuard} from '../guards/auth/auth.guard';
import {LoginGuard} from '../guards/login/login.guard';
import {PaymentFormComponent} from '../components/payment-form/payment-form.component';
import {SuccessComponent} from '../components/success/success.component';
import {MyProfileComponent} from '../components/my-profile/my-profile.component';
import {ChangePasswordComponent} from '../components/change-password/change-password.component';
import { CartComponent } from '../components/cart/cart.component';
import { OrderComponent } from '../components/order/order.component';
import { MyOrdersComponent } from '../components/my-orders/my-orders.component';
import { ProductDetailsComponent } from '../components/product-details/product-details.component';

const routes: Routes = [
  {path: '', redirectTo: 'products', pathMatch: 'full'},
  {path: 'login', component: LoginComponent, canActivate: [LoginGuard]},
  {path: 'products', component: ProductsComponent},
  {path: "product-details/:id", component: ProductDetailsComponent},
  {path: 'payment', component: PaymentFormComponent, canActivate: [AuthGuard]},
  {path: 'success', component: SuccessComponent, canActivate: [AuthGuard]},
  {path: 'my-profile', component: MyProfileComponent, canActivate: [AuthGuard]},
  {path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard]},
  {path: 'cart', component: CartComponent, canActivate: [AuthGuard]},
  {path: 'order', component: OrderComponent, canActivate: [AuthGuard]},
  {path: "my-orders", component: MyOrdersComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
