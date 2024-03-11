import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './product.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductImportComponent } from './product-import/product-import.component';

const routes: Routes = [
    { path: '', component: ProductComponent },
    {
        path: 'product-detail/:id',
        component: ProductDetailComponent,
        data: {
            title: 'Product Detail'
        }
    },
    {
        path: 'import',
        component: ProductImportComponent,
        data: {
            title: 'Import Product'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductRoutingModule { }
