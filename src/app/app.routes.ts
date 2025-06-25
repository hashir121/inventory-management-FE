import { Routes } from '@angular/router';
import { ProductComponent } from './components/product/product.component';
import { PurchaseComponent } from './components/purchase/purchase.component';
import { SalesComponent } from './components/sales/sales.component';

export const routes: Routes = [

    { path: 'product', component: ProductComponent },
    { path: 'purchase', component: PurchaseComponent },
    { path: 'sales', component: SalesComponent },
    { path: '', redirectTo: 'product', pathMatch: 'full' }, // default route
];
