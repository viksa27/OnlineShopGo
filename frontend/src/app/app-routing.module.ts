import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from '../components/login/login.component';
import {ProductsComponent} from '../components/products/products.component';
import {AuthGuard} from '../guards/auth/auth.guard';
import {LoginGuard} from '../guards/login/login.guard';
import {SuccessComponent} from '../components/success/success.component';
import {MyProfileComponent} from '../components/my-profile/my-profile.component';
import {ChangePasswordComponent} from '../components/change-password/change-password.component';
import { CartComponent } from '../components/cart/cart.component';
import { OrderComponent } from '../components/order/order.component';
import { MyOrdersComponent } from '../components/my-orders/my-orders.component';
import { ProductDetailsComponent } from '../components/product-details/product-details.component';
import { AdminGuard } from '../guards/admin/admin.guard';
import { CreateProductComponent } from '../components/create-product/create-product.component';
import { EditProductComponent } from '../components/edit-product/edit-product.component';
import { CategoryManagementComponent } from '../components/category-management/category-management.component';
import { AddAdminComponent } from '../components/add-admin/add-admin.component';

const routes: Routes = [
  {path: '', redirectTo: 'products', pathMatch: 'full'},
  {path: 'login', component: LoginComponent, canActivate: [LoginGuard]},

  {path: 'products', component: ProductsComponent},
  {path: "product-details/:id", component: ProductDetailsComponent},
  
  {path: 'success', component: SuccessComponent, canActivate: [AuthGuard]},
  {path: 'my-profile', component: MyProfileComponent, canActivate: [AuthGuard]},
  {path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard]},
  {path: 'cart', component: CartComponent, canActivate: [AuthGuard]},
  {path: 'order', component: OrderComponent, canActivate: [AuthGuard]},
  {path: "my-orders", component: MyOrdersComponent, canActivate: [AuthGuard]},

  {path: "create-product", component: CreateProductComponent, canActivate: [AdminGuard]},
  {path: "edit-product/:id", component: EditProductComponent, canActivate: [AdminGuard]},
  {path: "category-management", component: CategoryManagementComponent, canActivate: [AdminGuard]},
  {path: "add-admin", component: AddAdminComponent, canActivate: [AdminGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
