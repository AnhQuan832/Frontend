import { Component, OnInit } from '@angular/core';
import { DataView } from 'primeng/dataview';
import _ from 'lodash';
import { forkJoin } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
@Component({
    selector: 'app-shop-view',
    templateUrl: './shop-view.component.html',
    styleUrls: ['./shop-view.component.less'],
})
export class ShopViewComponent implements OnInit {
    responsiveOptions = [
        {
            breakpoint: '1199px',
            numVisible: 1,
            numScroll: 1,
        },
        {
            breakpoint: '991px',
            numVisible: 2,
            numScroll: 1,
        },
        {
            breakpoint: '767px',
            numVisible: 1,
            numScroll: 1,
        },
    ];
    priceRange;
    products = [
        {
            productId: 'prod_001',
            name: 'Product Name',
            subCategoryId: 'sub_001',
            subCategory: 'subCategory',
            price: 100,
            petTypeId: 1,
            petType: 'Pet Type',
            brandId: 'brand_001',
            images: [
                'https://firebasestorage.googleapis.com/v0/b/advance-totem-350103.appspot.com/o/Fund%2Fnha-cho-cho-bang-go.jpg?alt=media&token=f7553df5-a21b-497b-a200-b88a48139439',
                'image_url_2',
            ],
            brand: 'brand',
            detail: 'Product Detail',
            description: 'Product Description',
            avgRating: 4,
            varieties: 'varieties',
            status: 'active',
            varietyAttributeList: 'varietyAttributes',
            ratingList: 'ratingList',
        },
    ];
    searchValue;
    timeAutoPlay = 3000;
    sortedProd;
    defaultProd;
    protected selectedBrand = 'All';
    protected selectedCate = 'All';
    selectedCategory;
    listCate = [
        {
            key: '0',
            label: 'Clothes',
            data: 'Documents Folder',
            icon: 'pi pi-fw pi-inbox',
            children: [
                {
                    key: '0-0',
                    label: 'Dog',
                    data: 'Work Folder',
                    icon: 'pi pi-fw pi-cog',
                    // children: [
                    //     {
                    //         key: '0-0-0',
                    //         label: 'Expenses.doc',
                    //         icon: 'pi pi-fw pi-file',
                    //         data: 'Expenses Document',
                    //     },
                    //     {
                    //         key: '0-0-1',
                    //         label: 'Resume.doc',
                    //         icon: 'pi pi-fw pi-file',
                    //         data: 'Resume Document',
                    //     },
                    // ],
                },
                {
                    key: '0-1',
                    label: 'Cat',
                    data: 'Home Folder',
                    icon: 'pi pi-fw pi-home',
                    // children: [
                    //     {
                    //         key: '0-1-0',
                    //         label: 'Invoices.txt',
                    //         icon: 'pi pi-fw pi-file',
                    //         data: 'Invoices for this month',
                    //     },
                    // ],
                },
            ],
        },
    ];
    listBrand;
    constructor(private productService: ProductService) {}
    ngOnInit(): void {
        this.initialize();
    }

    private initialize() {
        // this.productService.getAllProduct().subscribe({
        //     next: (res) => {
        //         this.products = res;
        //         this.sortedProd = _.cloneDeep(this.products);
        //         this.defaultProd = _.cloneDeep(this.products);
        //     },
        //     error: (err) => console.log(err),
        // });
        // forkJoin([
        //     this.productService.getCategory(),
        //     this.productService.getBrand(),
        // ]).subscribe({
        //     next: (res: any) => {
        //         this.listCate = res[0];
        //         this.listBrand = res[1];
        //         this.listBrand.unshift({ name: 'All', brandId: 'All' });
        //         this.listCate.unshift({ name: 'All', categoryId: 'All' });
        //     },
        // });
    }

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warning';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return 'success';
        }
    }

    onUserSearched() {
        if (this.searchValue === '') {
            this.products = [...this.sortedProd];
            return;
        }
        const formatedValue = this.searchValue
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
        console.log(formatedValue);
        this.products = this.products.filter((prod) => {
            return Object.values(prod).some((value) =>
                String(value)
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .includes(formatedValue)
            );
        });
    }

    onFilter(dv: DataView, event: Event) {
        dv.filter((event.target as HTMLInputElement).value, 'contains');
    }

    onCheckboxBrandChange(event) {
        this.products = [...this.defaultProd];
        console.log(this.products);
        console.log(event);

        // if (event.value === 'All') {
        //     if (this.selectedCate === 'All') return;
        //     else {
        //         this.products = this.products.filter((prod) => {
        //             return (
        //                 prod.subCategory.category.categoryId ===
        //                 this.selectedCate
        //             );
        //         });
        //     }
        // } else {
        //     if (this.selectedCate === 'All')
        //         this.products = this.products.filter((prod) => {
        //             return prod.brand.brandId === event.value;
        //         });
        //     else
        //         this.products = this.products.filter((prod) => {
        //             return (
        //                 prod.brand.brandId === event.value &&
        //                 prod.subCategory.category.categoryId ===
        //                     this.selectedCate
        //             );
        //         });
        // }
        // this.sortedProd = [...this.products];
    }

    onCheckboxCateChange(event) {
        this.products = [...this.defaultProd];
        // if (event.value === 'All') {
        //     if (this.selectedBrand === 'All') return;
        //     else {
        //         this.products = this.products.filter((prod) => {
        //             return prod.brand.brandId === this.selectedBrand;
        //         });
        //     }
        // } else {
        //     if (this.selectedBrand === 'All')
        //         this.products = this.products.filter((prod) => {
        //             return prod.subCategory.category.categoryId === event.value;
        //         });
        //     else
        //         this.products = this.products.filter((prod) => {
        //             return (
        //                 prod.subCategory.category.categoryId === event.value &&
        //                 prod.brand.brandId === this.selectedBrand
        //             );
        //         });
        // }
        // this.sortedProd = [...this.products];
    }
}
