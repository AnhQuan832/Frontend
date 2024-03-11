import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProductService } from 'src/app/services/product.service';
import { ProductComponent } from '../../merchant-pages/product/product.component';

@Component({
    selector: 'app-charts',
    templateUrl: './add-sub-category.component.html',
    styleUrls: ['./add-sub-category.component.scss'],
})
export class AddSubCategory implements OnInit {
    categoryOption;
    category;
    name;
    addSubCategoryForm = this.builder.group({
        name: this.builder.control('', Validators.required),
        category: this.builder.control('', Validators.required),
    });
    constructor(
        private productSerivce: ProductService,
        private builder: FormBuilder,
        private ref: DynamicDialogRef,
        private productCpn: ProductComponent
    ) {}
    ngOnInit(): void {
        this.initialize();
    }

    initialize() {
        this.productSerivce.getCategory().subscribe({
            next: (res) => (this.categoryOption = res),
        });
    }

    addNewSubCategory() {
        this.productSerivce
            .addNewSubCategory(this.addSubCategoryForm.value)
            .subscribe({
                next: (res) => {
                    this.ref.close();
                    this.productCpn.showToast('Success', 'success');
                },
            });
    }
}
